;(function () {
  'use strict'

  activateSearch(require('docsearch.js/dist/cdn/docsearch.js'), document.getElementById('search-script').dataset)

  function activateSearch (docsearch, config) {
    appendStylesheet(config.stylesheet)
    var algoliaOptions = {
      hitsPerPage: parseInt(config.maxResults) || 25,
      advancedSyntax: true,
      advancedSyntaxFeatures: ['exactPhrase'],
    }
    var searchForm = document.querySelector('form.search')
    var controller = docsearch({
      appId: config.appId,
      apiKey: config.apiKey,
      indexName: config.indexName,
      inputSelector: '#search-query',
      autocompleteOptions: { autoselect: true, debug: true, hint: false, keyboardShortcuts: ['s'], minLength: 2 },
      algoliaOptions: algoliaOptions,
      transformData: transformData,
    })
    var eventEmitter = controller.autocomplete
    var autocomplete = eventEmitter.autocomplete
    autocomplete.setVal()
    eventEmitter.on('autocomplete:selected', disableClose)
    controller.input.data('aaAutocomplete').dropdown._ensureVisible = ensureVisible
    searchForm.addEventListener('click', confineEvent)
    document.documentElement.addEventListener('click', resetSearch.bind(autocomplete))
    if (controller.input.attr('autofocus') != null) controller.input.focus()
  }

  function appendStylesheet (href) {
    document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: href }))
  }

  function confineEvent (e) {
    e.stopPropagation()
  }

  function disableClose (e) {
    e.isDefaultPrevented = function () {
      return true
    }
  }

  function ensureVisible (el) {
    var item = el.get(0)
    var container = item
    while ((container = container.parentNode) && container !== document.documentElement) {
      if (window.getComputedStyle(container).overflowY === 'auto') break
    }
    if (!container || container.scrollHeight === container.offsetHeight) return
    var delta
    if ((delta = 15 + item.offsetTop + item.offsetHeight - (container.offsetHeight + container.scrollTop)) > 0) {
      container.scrollTop += delta
    }
    if ((delta = item.offsetTop - container.scrollTop) < 0) {
      container.scrollTop += delta
    }
  }

  function resetSearch () {
    this.close()
    this.setVal()
  }

  // qualify separate occurrences of the same lvl0 title so that the order of results is preserved
  function transformData (hits) {
    var prevLvl0Title
    var qualifiers = {}
    return hits.map(function (hit) {
      var lvl0Title = hit.hierarchy.lvl0
      var qualifier = qualifiers[lvl0Title]
      if (lvl0Title !== prevLvl0Title) qualifiers[lvl0Title] = qualifier == null ? '' : (qualifier += ' ')
      if (qualifier) hit.hierarchy.lvl0 = lvl0Title + qualifier
      prevLvl0Title = lvl0Title
      return hit
    })
  }
})()
