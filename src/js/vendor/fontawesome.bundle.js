;(function () {
  'use strict'
  ;[].slice.call(document.querySelectorAll('td.icon>i.fa')).forEach(function (el) {
    el.classList.remove('fa')
  })

  require('@fortawesome/fontawesome-free/js/v4-shims')
  var fa = require('@fortawesome/fontawesome-svg-core')

  ;(window.FontAwesomeIconDefs || []).forEach(function (faIconDef) {
    fa.library.add(faIconDef)
  })

  fa.dom.i2svg()
  delete window.___FONT_AWESOME___
  delete window.FontAwesomeIconDefs
})()
