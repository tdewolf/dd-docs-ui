var hash = window.location.hash
// var smallBreak = 768 // Your small screen breakpoint in pixels
find('.doc .tabset').forEach(function (tabset) {
  var active
  var queueData = []
  var checkActiveClass
  var tabs = tabset.querySelector('.tabs')
  if (tabs) {
    var first
    find('li', tabs).forEach(function (tab, idx) {
      var id = (tab.querySelector('a[id]') || tab).id
    //  console.log(tab)
      checkActiveClass = setTimeout(function () {
        var activeTabList = tab.classList.contains('is-active')
        if (activeTabList) {
          document
            .querySelector('.tabs')
            .insertAdjacentHTML(
              'beforeend',
              // '<div class="other-tab-box"><a href="#" class="dropddown-btn dropdown-btn-down">More... <i class="fas fa-chevron-circle-down"></i></a> <ul class="other-tablist" id="otherTabList"></ul></div>'
              '<div class="other-tab-box"><a href="#" class="dropddown-btn dropdown-btn-down">More... </a> <ul class="other-tablist" id="otherTabList"></ul></div>'
            )
          var dropdownBtn = document.querySelector('.dropdown-btn-down')
          var dropdownMenu = document.querySelector('.tabs .other-tablist')
          dropdownBtn.addEventListener('click', function (e) {
            e.preventDefault()
            if (dropdownMenu.style.display === 'block' || dropdownMenu.classList.contains('show')) {
              dropdownMenu.classList.remove('show')
              dropdownMenu.classList.add('hide')
            } else {
              dropdownMenu.classList.add('show')
              dropdownMenu.classList.remove('hide')
            }
          })
        }
      }, 100)

      if(idx > 3) {
        queueData.push(tab)
      }

      if (!id) return
      var pane = getPane(id, tabset)
      if (!idx) first = { tab: tab, pane: pane }
      if (!active && hash === '#' + id && (active = true)) {
        tab.classList.add('is-active')
        if (pane) pane.classList.add('is-active')

      } else if (!idx) {
        tab.classList.remove('is-active')
        if (pane) pane.classList.remove('is-active')
      }
      tab.addEventListener('click', activateTab.bind({ tabset: tabset, tab: tab, pane: pane }))
    })
    if (!active && first) {
      first.tab.classList.add('is-active')
      if (first.pane) first.pane.classList.add('is-active')
    }

  }

  setTimeout(function () {
    var appendMoreTabList =  document.getElementById('otherTabList')

    queueData.forEach(function (tablist) {
        appendMoreTabList.appendChild(tablist)
    })

  }, 100)

  tabset.classList.remove('is-loading')
  clearTimeout(checkActiveClass, 20000)
})

function activateTab (e) {
  e.preventDefault()
  var tab = this.tab
  var pane = this.pane
  var dropdownMenu = document.querySelector('.tabs ul')
 // var dropdownBtnIcon = document.querySelector('.dropdown-btn-down .fas')

  var nodeTab = document.querySelector('.tabs > ul')
  var nodeDropdownTabNode = document.querySelector('.other-tablist')

  if( tab.parentNode.classList[0] ==  'other-tablist') {
      nodeDropdownTabNode.appendChild(nodeTab.lastElementChild)
       nodeTab.appendChild(tab)
  }

  var activeTabList = tab.classList.contains('is-active')
  // console.log(activeTabList, 127)
  if (activeTabList) {
      dropdownMenu.classList.remove('show')
    }

  find('.tabs li, .tab-pane', this.tabset).forEach(function (it) {
    it === tab || it === pane ? it.classList.add('is-active') : it.classList.remove('is-active')
  })
}

function find (selector, from) {
  return Array.prototype.slice.call((from || document).querySelectorAll(selector))
}
setTimeout(function () {
  document.querySelector(' .dropddown-btn').addEventListener('click', function (e) {
    e.preventDefault()
  })

}, 1000)

function getPane (id, tabset) {
  return find('.tab-pane', tabset).find(function (it) {
    return it.getAttribute('aria-labelledby') === id
  })
}

