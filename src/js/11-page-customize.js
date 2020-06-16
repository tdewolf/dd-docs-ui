;(function ($) {
  'use strict'
  // for label edition/statuses
  var $labels = $('.edition').find('a')
  console.log($labels.length)
  for (var i = 0; i < $labels.length; i++) {
    console.log(i, 445, $labels[i])
    if ($labels[i].text.toLocaleLowerCase().indexOf('community') !== -1) {
      $labels[i].parentNode.classList.add('page-edition')
    }
  }

  /*eslint-env jquery*/
})(jQuery)
