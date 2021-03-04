;(function () {
  'use strict'

  activateSearch(require('docsearch.js/dist/cdn/docsearch.js'), document.getElementById('search-script').dataset)

  function activateSearch (docsearch, config) {
    appendStylesheet(config.stylesheet)
    var algoliaOptions = {
      hitsPerPage: parseInt(config.maxResults) || 25,
    }
    var searchForm = document.querySelector('form.search')
    var controller = docsearch({
      appId: config.appId,
      apiKey: config.apiKey,
      indexName: config.indexName,
      inputSelector: '#search-query',
      autocompleteOptions: { autoselect: true, debug: true, hint: false, keyboardShortcuts: ['s'], minLength: 2 },
      algoliaOptions: algoliaOptions,
    })
    var eventEmitter = controller.autocomplete
    var autocomplete = eventEmitter.autocomplete
    autocomplete.setVal()
    eventEmitter.on('autocomplete:selected', disableClose)
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

  function resetSearch () {
    this.close()
    this.setVal()
  }
})()
