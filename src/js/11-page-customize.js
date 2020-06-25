;(function ($) {
  'use strict'
  var tableBlock = document.querySelectorAll('table.tableblock')
  // for label edition/statuses
  var $labels = $('.edition').find('a')
  for (var i = 0; i < $labels.length; i++) {
    if ($labels[i].text.toLocaleLowerCase().indexOf('community') !== -1) {
      $labels[i].parentNode.classList.add('page-edition')
    }
  }
  // add a caption class for all tablelock
  tableBlock.forEach(function (elem, index) {
    if (elem.caption !== null) {
      elem.classList.add('caption-table')
    }
  })
  /*eslint-env jquery*/
})(jQuery)
