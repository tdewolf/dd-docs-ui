;(function () {
  'use strict'

  ;[].slice.call(document.querySelectorAll('td.icon>i.fa')).forEach(function (el) {
    el.classList.remove('fa')
  })

  var fa = require('@fortawesome/fontawesome-svg-core')

  window.FontAwesomeIconDefs.forEach(function (faIconDef) {
    fa.library.add(faIconDef)
  })

  fa.dom.i2svg()
})()
