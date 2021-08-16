;(function () {
  'use strict'
  var runCodeLangs = { cpp: 'cc', csharp: 'dotnet', js: 'nodejs', python: 'py', ruby: 'rb' }
  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
    var pre = codeBlock.parentNode
    var viewSourceLink
    var sourceUrl = codeBlock.dataset.sourceUrl
    if (sourceUrl) {
      viewSourceLink = document.createElement('a')
      viewSourceLink.href = codeBlock.dataset.sourceUrl
      viewSourceLink.className = 'view-source-button'
      viewSourceLink.target = '_blank'
      viewSourceLink.dataset.title = 'View On GitHub'
      viewSourceLink.appendChild(document.createElement('i')).className = 'fab fa-github'
    }
    var sourceTypeBox = document.createElement('div')
    sourceTypeBox.className = 'source-type-box'

    var headingBox = document.createElement('div')
    headingBox.className = 'col-2 left-block'

    var sourceTypeBoxCol2 = document.createElement('div')
    sourceTypeBoxCol2.className = 'col-2 right-block'

    var copyButton = document.createElement('a')
    copyButton.className = 'copy-code-button'
    copyButton.dataset.title = 'Copy'
    copyButton.appendChild(document.createElement('i')).className = 'far fa-copy'
    var copyText = document.createTextNode('Copy')
    copyButton.appendChild(copyText)

    var dataSource = document.createElement('span')
    dataSource.className = 'data-source'
    dataSource.innerHTML += codeBlock.dataset.lang

    var fadeShadow = document.createElement('span')
    fadeShadow.className = 'fade-shadow'

    copyButton.addEventListener('click', function (e) {
      // NOTE: ignore event on pseudo-element
      if (e.currentTarget === e.target) return
      var bashText = codeBlock.innerText
      // remove '$' from copy to code functionality in code block console
      // var spliceData = bashText.split('$').join('')
      var check = bashText.charAt(0)
      if (check === '$') {
        var spliceData = bashText.substring(2)
        navigator.clipboard.writeText(spliceData).then(
          function () {
            /* Chrome doesn't seem to blur automatically,
                leaving the button in a focused state. */
            copyButton.blur()
            copyButton.dataset.title = 'Copied ✓'
            setTimeout(function () {
              copyButton.dataset.title = 'Copy'
            }, 2000)
          },
          function () {
            copyButton.dataset.title = 'Error'
          }
        )
      } else {
        navigator.clipboard.writeText(codeBlock.innerText).then(
          function () {
            /* Chrome doesn't seem to blur automatically,
                leaving the button in a focused state. */
            copyButton.blur()
            copyButton.dataset.title = 'Copied ✓'
            setTimeout(function () {
              copyButton.dataset.title = 'Copy'
            }, 2000)
          },
          function () {
            copyButton.dataset.title = 'Error'
          }
        )
      }
    })

    var runCodeButton
    if (codeBlock.matches('.listingblock.try-it code') ||
        (codeBlock.matches('#full-example + .sectionbody .tab-pane > .listingblock:first-child code'))) {
      runCodeButton = document.createElement('a')
      runCodeButton.className = 'run-code'
      runCodeButton.dataset.title = 'Run Code'
      runCodeButton.appendChild(document.createElement('i')).className = 'fas fa-terminal'
      var runCodeButtonText = document.createTextNode('Run Code')
      runCodeButton.appendChild(runCodeButtonText)
      var runCodePanel = createRunCodePanel()
      runCodeButton.addEventListener('click', function () {
        document.documentElement.classList.add('terminal-launched')
        const runCodeForm = runCodePanel.querySelector('form')
        runCodeForm.lang.value = runCodeLangs[codeBlock.dataset.lang] || codeBlock.dataset.lang
        runCodeForm.code.value = codeBlock.innerText
        runCodeForm.submit()
      })
    }

    pre.prepend(sourceTypeBox)
    sourceTypeBox.appendChild(headingBox)
    sourceTypeBox.appendChild(sourceTypeBoxCol2)
    sourceTypeBoxCol2.appendChild(dataSource)
    if (viewSourceLink) sourceTypeBoxCol2.appendChild(viewSourceLink)
    sourceTypeBoxCol2.appendChild(copyButton)
    if (runCodeButton) sourceTypeBoxCol2.appendChild(runCodeButton)
    pre.appendChild(fadeShadow)
  })

  function createRunCodePanel () {
    var runCodePanel = document.getElementById('run-code-panel')
    if (runCodePanel.tagName !== 'TEMPLATE') return runCodePanel
    var template = runCodePanel
    runCodePanel = document.body.appendChild(template.content.firstElementChild.cloneNode(true))
    runCodePanel.querySelector('.close').addEventListener('click', function (e) {
      e.preventDefault()
      document.documentElement.classList.remove('terminal-launched')
    })
    template.parentNode.removeChild(template)
    runCodePanel.id = 'run-code-panel'
    return runCodePanel
  }
})()
