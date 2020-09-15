;(function () {
  'use strict'

  var nav = document.querySelector('nav.nav')
  var menuExpandToggle = document.querySelector('.menu-expand-toggle')
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

  // fitNavMenuInit({})
  // window.addEventListener('load', fitNavMenuInit)
  // window.addEventListener('resize', fitNavMenuInit)

  if ((navControl = document.querySelector('main .nav-control'))) navControl.addEventListener('click', revealNav)

  // function scrollItemToMiddle (el, parentEl) {
  //   var adjustment = (el.getBoundingClientRect().height - parentEl.getBoundingClientRect().height) * 0.5 + el.offsetTop
  //   if (adjustment > 0) parentEl.scrollTop = adjustment
  // }

  // function fitNavMenuInit (e) {
  //   window.removeEventListener('scroll', fitNavMenuOnScroll)
  //   navMenu.element.style.height = ''
  //   if ((navMenu.preferredHeight = navMenu.element.getBoundingClientRect().height) > 0) {
  //     // QUESTION should we check if x value > 0 instead?
  //     if (window.getComputedStyle(nav).visibility === 'visible') {
  //       if (!navMenu.encroachingElement) navMenu.encroachingElement = document.querySelector('footer.footer')
  //       fitNavMenu(navMenu.preferredHeight, (navMenu.viewHeight = window.innerHeight), navMenu.encroachingElement)
  //       window.addEventListener('scroll', fitNavMenuOnScroll)
  //     }
  //     if (currentPageItem && e.type !== 'resize') {
  //       scrollItemToMiddle(currentPageItem.querySelector('.nav-link'), navMenu.element)
  //     }
  //   }
  // }

  // function fitNavMenuOnScroll () {
  //   fitNavMenu(navMenu.preferredHeight, navMenu.viewHeight, navMenu.encroachingElement)
  // }

  // function fitNavMenu (preferredHeight, availableHeight, encroachingElement) {
  //   var reclaimedHeight = availableHeight - encroachingElement.getBoundingClientRect().top
  /*eslint max-len: ["error", { "code": 180 }]*/
  //   navMenu.element.style.height = reclaimedHeight > 0 ? Math.max(0, preferredHeight - reclaimedHeight) + 'px' : ''
  // }

  // var navMenuControl
  // if (document.querySelector('.main-nav-parent')) {
  //   navMenuControl = document.querySelector('.main-nav-parent')
  //   navMenuControl.addEventListener('click', function () {
  //     for (var i = 0; i < navItems.length; i++) {
  //       navItems[i].classList.remove('is-active')
  //       navItems[i].classList.remove('is-inactive')
  //       navItems[i].classList.remove('open')
  //     }
  //     this.style.display = 'none'
  //   })
  // }
  // Toggle class
  function toggleActive (e) {
    // if (this.getAttribute('data-depth') === '1') {
    //   var otherNavs = document.querySelectorAll('.nav-item[data-depth="0"]:not(.is-active)')
    //   for (var i = 0; i < otherNavs.length; i++) {
    //     otherNavs[i].classList.add('is-inactive')
    //   }
    // }
    this.classList.toggle('open')
    this.classList.toggle('is-active')
  }

  // var navItems = document.querySelectorAll('.nav .nav-item')
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
