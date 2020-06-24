;(function ($) {
  'use strict'
  var tableBlock = document.querySelectorAll('table.tableblock')
  // for label edition/statuses
  var $labels = $('.edition').find('a')

  for (var i = 0; i < $labels.length; i++) {
  //  console.log(i, 445, $labels[i])
    if ($labels[i].text.toLocaleLowerCase().indexOf('community') !== -1) {
      $labels[i].parentNode.classList.add('page-edition')
    }
  }

  // add a caption class for all tablelock

  tableBlock.forEach(function(arr, index) {
    console.log(arr)
    // if(arr.caption.title)
    if(arr.caption !== null) {
      arr.classList.add('caption-table')
    }

  })

  /*eslint-env jquery*/
})(jQuery)
