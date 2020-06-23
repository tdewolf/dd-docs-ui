;(function () {
  'use strict'

  var nav = document.querySelector('nav.nav')
  var navMenu = {}
  if (!(navMenu.element = nav && nav.querySelector('.nav-menu'))) return
  var navControl
  //var currentPageItem = navMenu.element.querySelector('.is-current-page')

  // NOTE prevent text from being selected by double click
  navMenu.element.addEventListener('mousedown', function (e) {
    if (e.detail > 1) e.preventDefault()
  })

  find(/*'.nav-toggle',*/ '.in-toggle', navMenu.element).forEach(function (toggleBtn) {
    var navItem = findAncestorWithClass('nav-item', toggleBtn, navMenu.element)
    toggleBtn.addEventListener('click', toggleActive.bind(navItem))
    // var dataDepth = toggleBtn.getAttribute('data-depth')
    // if (dataDepth === 1) {
    //   toggleBtn.classList.add("mystyle")
    // }
    // toggleBtn.addEventListener('click', addActive.bind(navItem))

    var navItemSpan = findNextElement(toggleBtn)
    if (navItemSpan.classList.contains('nav-text')) {
      navItemSpan.style.cursor = 'pointer'
      navItemSpan.addEventListener('click', toggleActive.bind(navItem))
      // navItemSpan.addEventListener('click', addActive.bind(navItem))
    }
  })

  // fitNavMenuInit({})
  // window.addEventListener('load', fitNavMenuInit)
  // window.addEventListener('resize', fitNavMenuInit)

  if ((navControl = document.querySelector('main .nav-control'))) navControl.addEventListener('click', revealNav)
  var navMenuControl
  if (document.querySelector('.main-nav-parent')) {
    navMenuControl = document.querySelector('.main-nav-parent')
    navMenuControl.addEventListener('click', function () {
      //   navWrap.style.display = 'none'
      for (var i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove('is-active')
        navItems[i].classList.remove('is-inactive')
        navItems[i].classList.remove('open')
      }
      this.style.display = 'none'
    })
  }
  // Toggle class
  function toggleActive (e) {
    if (this.getAttribute('data-depth') === '1') {
      var otherNavs = document.querySelectorAll('.nav-item[data-depth="0"]:not(.is-active)')
      for (var i = 0; i < otherNavs.length; i++) {
        otherNavs[i].classList.add('is-inactive')
      }
    }
    this.classList.toggle('open')
    this.classList.toggle('is-active')
  }

  var navItems = document.querySelectorAll('.nav .nav-item')
  function revealNav (e) {
    if (nav.classList.contains('is-active')) return hideNav(e)
    document.documentElement.classList.add('is-clipped--nav')
    nav.classList.add('is-active')
    nav.addEventListener('click', concealEvent)
    window.addEventListener('click', hideNav)
    concealEvent(e) // NOTE don't let event get picked up by window click listener
  }

  function hideNav (e) {
    if (e.which === 3 || e.button === 2) return
    document.documentElement.classList.remove('is-clipped--nav')
    nav.classList.remove('is-active')
    nav.removeEventListener('click', concealEvent)
    window.removeEventListener('click', hideNav)
    concealEvent(e) // NOTE don't let event get picked up by window click listener
  }

  function find (selector, from) {
    return [].slice.call((from || document).querySelectorAll(selector))
  }

  function findAncestorWithClass (className, from, scope) {
    if ((from = from.parentNode) !== scope) {
      if (from.classList.contains(className)) {
        return from
      } else {
        return findAncestorWithClass(className, from, scope)
      }
    }
  }

  function findNextElement (from, el) {
    if ((el = from.nextElementSibling)) return el
    el = from
    while ((el = el.nextSibling) && el.nodeType !== 1);
    return el
  }

  // has children in li
  // $('ul.nav-list li.nav-item ul.nav-list .nav-item').has('ul.nav-list').addClass('has-children')
  function concealEvent (e) {
    e.stopPropagation()
  }
})()
