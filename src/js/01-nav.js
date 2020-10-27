;(function () {
  'use strict'

  var nav = document.querySelector('nav.nav')
  var menuExpandToggle = document.querySelector('.menu-expand-toggle')
  var versionToggle = document.querySelector('.clickable')
  var versionDropdownList = document.querySelector('.frame-dropdown')
  var navMenu = {}
  if (!(navMenu.element = nav && nav.querySelector('.nav-menu'))) return
  var navControl
  // var currentPageItem = navMenu.element.querySelector('.is-current-page')

  // NOTE prevent text from being selected by double click
  navMenu.element.addEventListener('mousedown', function (e) {
    if (e.detail > 1) e.preventDefault()
  })

  find(/*'.nav-toggle',*/ '.in-toggle', navMenu.element).forEach(function (toggleBtn) {
    // console.log(toggleBtn, 17)
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

  if ((navControl = document.querySelector('main .nav-control'))) navControl.addEventListener('click', revealNav)

  // Toggle class
  function toggleActive (e) {
    // this.classList.toggle('open')
    this.classList.toggle('is-active')
  }

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

  menuExpandToggle.addEventListener('click', function (e) {
    e.preventDefault()
    if (nav.classList.contains('collapse-menu')) {
      nav.classList.remove('collapse-menu')
    } else {
      nav.classList.add('collapse-menu')
    }
  })

  if (versionToggle) {
    versionToggle.addEventListener('click', function (e) {
      e.preventDefault()
      if (versionDropdownList.classList.contains('show')) {
        versionDropdownList.classList.remove('show')
      } else {
        versionDropdownList.classList.add('show')
      }
      concealEvent(e)
    })
  }

  window.addEventListener('click', function (e) {
    versionDropdownList.classList.remove('show')
  })

  // has children in li
  function concealEvent (e) {
    e.stopPropagation()
  }
  // scroll left menu to current active page
  setTimeout(function () {
    if (document.querySelector('.is-current-page')) {
      var currentPageMenu = document.querySelector('.is-current-page')
      var topPositon = currentPageMenu.offsetTop - 100
      var leftMenu = document.querySelector('.left-sidebar-menu .nav-menu')
      leftMenu.scrollTop = topPositon
    }
  }, 100) //setTime Out end

  // show depth 0 child element
  if (document.querySelector('.is-current-page')) {
    var otherNavs = document.querySelectorAll('.nav-list > .nav-item[data-depth="0"]')
    otherNavs.forEach(function (nav) {
      var navSubMenu = Array.from(nav.querySelector('ul.nav-list').children)
      // var navDataDepth = Array.from(nav.querySelector('ul.nav-list'))
      navSubMenu.forEach(function (item) {
        item.classList.remove('is-inactive')
      })

      // hide main menu for top level navigation -

      // if (nav.className.includes('is-current-page')) {
      //   navMenuControl.style.display = 'none'
      // }

      // hide in second level menu
      if (nav.className.includes('is-current-path')) {
        otherNavs.forEach(function (navItem) {
          if (!navItem.className.includes('is-current-path')) {
            navItem.classList.add('is-inactive')
          }
        })
      }
    })
  } // if condition end

  // clearTimeout(scrollCurrentPageMenu, 20000)
})()
