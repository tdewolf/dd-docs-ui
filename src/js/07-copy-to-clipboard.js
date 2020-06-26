;(function () {
  'use strict'
  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
    var viewSourceLink
    var sourceUrl = codeBlock.dataset.sourceUrl
    if (sourceUrl) {
      viewSourceLink = document.createElement('a')
      viewSourceLink.href = codeBlock.dataset.sourceUrl
      viewSourceLink.className = 'view-source-button'
      viewSourceLink.target = '_blank'
      viewSourceLink.dataset.title = 'View On Github'
      viewSourceLink.appendChild(document.createTextNode('View'))
    }
    // console.log(codeBlock)
    var sourceTypeBox = document.createElement('div')
    sourceTypeBox.className = 'source-type-box'
    var copyButton = document.createElement('a')
    copyButton.className = 'copy-code-button'
    //copyButton.type = 'button'
    copyButton.dataset.title = 'Copy'

    var dataSource = document.createElement('span')
    dataSource.className = 'data-source'
    dataSource.innerHTML += codeBlock.dataset.lang

    var fadeShadow = document.createElement('span')
    fadeShadow.className = 'fade-shadow'

    copyButton.addEventListener('click', function (e) {
      if (e.target && e.target.matches('a.copy-code-button')) {
        // for console text
        if (codeBlock.dataset.lang === 'console') {
          var bashText = codeBlock.innerText
          // remove $ from text
          navigator.clipboard.writeText(bashText.slice(2)).then(
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
      }
    })
    var pre = codeBlock.parentNode
    pre.appendChild(sourceTypeBox)
    sourceTypeBox.appendChild(dataSource)
    if (viewSourceLink) sourceTypeBox.appendChild(viewSourceLink)
    sourceTypeBox.appendChild(copyButton)
    pre.appendChild(fadeShadow)
  })
})()
