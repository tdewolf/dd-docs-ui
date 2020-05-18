;(function () {
    'use strict'

    var clearAllBtn = document.querySelector('#clearALLBtn')
    var menuList = document.querySelectorAll('.nav-list .nav-link')

    clearAllBtn.addEventListener('click', function (e) {
        e.preventDefault()
        var inputs = document.querySelectorAll('.check-mark')
        for(var i = 0; i < inputs.length; i++) {
          inputs[i].checked = false
        }
      })

        // function menuClickEvent(id) {
        //     for(var i = 0; i < menuList.length; i++) {
        //             console.log(menuList[i], id, menuList[id])
        //       }

        // }
        // Handlebars.registerHelper("menuClickEvent", function(id) {
        //     console.log("hello", id)
        //   });

     //   document.getElementsByClassName('nav-link').addEventListener('click', menuClickEvent)
        //   menuClick.addEventListener('click', function(e){

    //   })


  })()
