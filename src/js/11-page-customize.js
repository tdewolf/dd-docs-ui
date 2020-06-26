;(function () {
  'use strict'

  // hide admonition icons from Font Awesome i2svg
  // FIXME: eventually we want to add the right prefix so that these icons get loaded from Font Awesome
  ;[].slice.call(document.querySelectorAll('td.icon > i.fa')).forEach(function (el) {
    el.classList.remove('fa')
  })
  // for label edition/statuses
  ;[].slice.call(document.querySelectorAll('.edition a')).forEach(function (a) {
    if (~a.innerText.toLowerCase().indexOf('community')) a.parentNode.classList.add('page-edition')
  })
  // add a caption class for all tablelock
  ;[].slice.call(document.querySelectorAll('table.tableblock')).forEach(function (table) {
    if (table.caption) table.classList.add('caption-table')
  })
})()
