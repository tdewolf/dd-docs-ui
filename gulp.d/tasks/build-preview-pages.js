'use strict'

const asciidoctor = require('asciidoctor.js')()
const fs = require('fs-extra')
const handlebars = require('handlebars')
const iconPacks = {
  fas: (() => {
    try {
      return require('@fortawesome/pro-solid-svg-icons')
    } catch (e) {}
  })(),
  far: (() => {
    try {
      return require('@fortawesome/pro-regular-svg-icons')
    } catch (e) {}
  })(),
  fab: require('@fortawesome/free-brands-svg-icons'),
}
iconPacks.fa = iconPacks.fas
const iconShims = require('@fortawesome/fontawesome-free/js/v4-shims').reduce((accum, it) => {
  accum[it[0]] = [it[1] || 'fas', it[2] || it[0]]
  return accum
}, {})
const { obj: map } = require('through2')
const merge = require('merge-stream')
const ospath = require('path')
const path = ospath.posix
const requireFromString = require('require-from-string')
const vfs = require('vinyl-fs')
const yaml = require('js-yaml')

const ASCIIDOC_ATTRIBUTES = { experimental: '', icons: 'font', sectanchors: '', 'source-highlighter': 'highlight.js' }

module.exports = (src, previewSrc, previewDest, sink = () => map()) => (done) =>
  Promise.all([
    loadSampleUiModel(previewSrc),
    toPromise(
      merge(compileLayouts(src), registerPartials(src), registerHelpers(src), copyImages(previewSrc, previewDest))
    ),
  ])
    .then(([baseUiModel, { layouts }]) => [{ ...baseUiModel, env: process.env }, layouts])
    .then(([baseUiModel, layouts]) =>
      vfs
        .src('**/*.adoc', { base: previewSrc, cwd: previewSrc })
        .pipe(
          map((file, enc, next) => {
            const siteRootPath = path.relative(ospath.dirname(file.path), ospath.resolve(previewSrc))
            const uiModel = { ...baseUiModel }
            uiModel.siteRootPath = siteRootPath
            uiModel.siteRootUrl = path.join(siteRootPath, 'index.html')
            uiModel.uiRootPath = path.join(siteRootPath, '_')
            if (file.stem === '404') {
              uiModel.page = { layout: '404', title: 'Page Not Found' }
            } else {
              const pageModel = (uiModel.page = { ...uiModel.page })
              const doc = asciidoctor.load(file.contents, { safe: 'safe', attributes: ASCIIDOC_ATTRIBUTES })
              const attributes = doc.getAttributes()
              pageModel.layout = doc.getAttribute('page-layout', 'default')
              pageModel.title = doc.getDocumentTitle()
              pageModel.url = '/' + file.relative.slice(0, -5) + '.html'
              if (file.stem === 'home') pageModel.home = true
              const componentName = doc.getAttribute('page-component-name', pageModel.src.component)
              const versionString = doc.getAttribute(
                'page-version',
                doc.hasAttribute('page-component-name') ? undefined : pageModel.src.version
              )
              let component
              let componentVersion
              if (componentName) {
                component = pageModel.component = uiModel.site.components[componentName]
                componentVersion = pageModel.componentVersion = versionString
                  ? component.versions.find(({ version }) => version === versionString)
                  : component.latest
              } else {
                component = pageModel.component = Object.values(uiModel.site.components)[0]
                componentVersion = pageModel.componentVersion = component.latest
              }
              pageModel.module = 'ROOT'
              pageModel.relativeSrcPath = file.relative
              pageModel.version = componentVersion.version
              pageModel.displayVersion = componentVersion.displayVersion
              pageModel.editUrl = pageModel.origin.editUrlPattern.replace('%s', file.relative)
              pageModel.navigation = componentVersion.navigation || []
              pageModel.breadcrumbs = findNavPath(pageModel.url, pageModel.navigation)
              if (pageModel.component.versions.length > 1) {
                pageModel.versions = pageModel.component.versions.map(({ version, displayVersion, url }, idx, arr) => {
                  const pageVersion = { version, displayVersion: displayVersion || version, url }
                  if (version === component.latest.version) pageVersion.latest = true
                  if (idx === arr.length - 1) {
                    delete pageVersion.url
                    pageVersion.missing = true
                  }
                  return pageVersion
                })
              }
              pageModel.attributes = Object.entries({ ...attributes, ...componentVersion.asciidoc.attributes })
                .filter(([name, val]) => name.startsWith('page-'))
                .reduce((accum, [name, val]) => ({ ...accum, [name.substr(5)]: val }), {})
              pageModel.contents = Buffer.from(doc.convert())
            }
            file.extname = '.html'
            try {
              file.contents = Buffer.from(layouts.get(uiModel.page.layout)(uiModel))
              next(null, injectIconDefs(file))
            } catch (e) {
              next(transformHandlebarsError(e, uiModel.page.layout))
            }
          })
        )
        .pipe(vfs.dest(previewDest))
        .on('error', (e) => done)
        .pipe(sink())
    )

function loadSampleUiModel (src) {
  return fs.readFile(ospath.join(src, 'ui-model.yml'), 'utf8').then((contents) => {
    const uiModel = yaml.safeLoad(contents)
    uiModel.env = process.env
    Object.entries(uiModel.site.components).forEach(([name, component]) => {
      component.name = name
      if (!component.versions) component.versions = [(component.latest = { url: '#' })]
      component.versions.forEach((version) => {
        Object.defineProperty(version, 'name', { value: component.name, enumerable: true })
        if (!('displayVersion' in version)) version.displayVersion = version.version
        if (!('asciidoc' in version)) version.asciidoc = { attributes: {} }
      })
      Object.defineProperties(component, {
        asciidoc: {
          get () {
            return this.latest.asciidoc
          },
        },
        title: {
          get () {
            return this.latest.title
          },
        },
        url: {
          get () {
            return this.latest.url
          },
        },
      })
    })
    return uiModel
  })
}

function registerPartials (src) {
  return vfs.src('partials/*.hbs', { base: src, cwd: src }).pipe(
    map((file, enc, next) => {
      handlebars.registerPartial(file.stem, file.contents.toString())
      next()
    })
  )
}

function registerHelpers (src) {
  handlebars.registerHelper('relativize', relativize)
  handlebars.registerHelper('resolvePage', resolvePage)
  handlebars.registerHelper('resolvePageURL', resolvePageURL)
  return vfs.src('helpers/*.js', { base: src, cwd: src }).pipe(
    map((file, enc, next) => {
      handlebars.registerHelper(file.stem, requireFromString(file.contents.toString()))
      next()
    })
  )
}

function compileLayouts (src) {
  const layouts = new Map()
  return vfs.src('layouts/*.hbs', { base: src, cwd: src }).pipe(
    map(
      (file, enc, next) => {
        const srcName = path.join(src, file.relative)
        layouts.set(file.stem, handlebars.compile(file.contents.toString(), { preventIndent: true, srcName }))
        next()
      },
      function (done) {
        this.push({ layouts })
        done()
      }
    )
  )
}

function copyImages (src, dest) {
  return vfs.src('**/*.{png,svg}', { base: src, cwd: src }).pipe(vfs.dest(dest))
}

function findNavPath (currentUrl, node = [], current_path = [], root = true) {
  for (const item of node) {
    const { url, items } = item
    if (url === currentUrl) {
      return current_path.concat(item)
    } else if (items) {
      const activePath = findNavPath(currentUrl, items, current_path.concat(item), false)
      if (activePath) return activePath
    }
  }
  if (root) return []
}

function injectIconDefs (file) {
  const contents = file.contents
  if (!contents.includes('<i class="fa')) return file
  const stringContents = contents.toString()
  const iconNames = stringContents.match(new RegExp('<i class="fa[brs]? fa-[^" ]+', 'g')).map((it) => {
    return it.substr(10).replace(' fa-', ' ')
  })
  if (!iconNames.length) return file
  const iconDefs = [...new Set(iconNames)].reduce((accum, it) => {
    const [iconPrefix, iconName] = it.split(' ').slice(0, 2)
    let iconDef = (iconPacks[iconPrefix] || {})['fa' + camelCase(iconName)]
    if (iconDef) {
      return accum.concat({ ...iconDef, prefix: iconPrefix })
    } else if (iconPrefix === 'fa') {
      const [realIconPrefix, realIconName] = iconShims[iconName] || []
      if (realIconName && (iconDef = (iconPacks[realIconPrefix] || {})['fa' + camelCase(realIconName)])) {
        return accum.concat({ ...iconDef, prefix: realIconPrefix })
      }
    }
    return accum
  }, [])
  const iconData = `<script>\nwindow.FontAwesomeIconDefs = ${JSON.stringify(iconDefs)}\n</script>`
  file.contents = Buffer.from(
    stringContents.replace(new RegExp('<script async src="[^"]*_/js/vendor/fontawesome.js"></script>'), function (m) {
      return [iconData, m].join('\n')
    })
  )
  return file
}

function relativize (url) {
  return url ? (url.charAt() === '#' ? url : url.slice(1)) : '#'
}

function resolvePage (spec, context = {}) {
  if (spec) return { pub: { url: resolvePageURL(spec) } }
}

function resolvePageURL (spec, context = {}) {
  if (spec) return '/' + (spec = spec.split(':').pop()).slice(0, spec.lastIndexOf('.')) + '.html'
}

function transformHandlebarsError ({ message, stack }, layout) {
  const m = stack.match(/^ *at Object\.ret \[as (.+?)\]/m)
  const templatePath = `src/${m ? 'partials/' + m[1] : 'layouts/' + layout}.hbs`
  const err = new Error(`${message}${~message.indexOf('\n') ? '\n^ ' : ' '}in UI template ${templatePath}`)
  err.stack = [err.toString()].concat(stack.substr(message.length + 8)).join('\n')
  return err
}

function toPromise (stream) {
  return new Promise((resolve, reject, data = {}) =>
    stream
      .on('error', reject)
      .on('data', (chunk) => chunk.constructor === Object && Object.assign(data, chunk))
      .on('finish', () => resolve(data))
  )
}

function camelCase (str) {
  return str.replace(/(?:^|-)(.)/g, function (_, l) { return l.toUpperCase() })
}
