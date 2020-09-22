;
(function () {
  'use strict'
  // for slide toggle
  if (document.querySelector('.tutorials-filter')) {
    // all variables declare here
    // var tutorialsFilter = document.querySelector('.tutorials-filter')
    var navLink = document.querySelectorAll('.nav-menu.filter li a')
    var allData = document.querySelectorAll('.data-filter-column')

    // looping through the all chekbox link
    navLink.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault()
        this.classList.toggle('active')
        this.nextElementSibling.classList.toggle('open')
      })
    })
    //   // add class even odd
    allData.forEach(function (column, index) {
      if (index % 2 === 1) {
        allData[index].classList.add('even')
      } else {
        allData[index].classList.add('odd')
      }
    })
    //   // for filter menus
    var filterMenuCheckboxes = document.querySelectorAll('input[type="checkbox"]')
    var selectedFiltersData = {}
    filterMenuCheckboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', function (event) {
        event.preventDefault()
        var self = this
        /*eslint no-unused-vars: "error"*/
        // var checkedData = [].filter.call(filterMenuCheckboxes, function (el) {
        //   return el.checked
        // })
        if (checkbox.checked === true) {
          if (!Object.prototype.hasOwnProperty.call(selectedFiltersData, self.name)) {
            selectedFiltersData[self.name] = []
          }
          selectedFiltersData[self.name].push(self.value.toLowerCase())
        }
        if (checkbox.checked === false) {
          var index = selectedFiltersData[self.name].indexOf(self.value)
          if (selectedFiltersData[self.name].length === 1) {
            delete selectedFiltersData[self.name]
          } else {
            selectedFiltersData[self.name].splice(index, 1)
          }
        }
        // remove odd even class while clicking on checkbox
        allData.forEach(function (column) {
          column.classList.remove('odd')
          column.classList.remove('even')
        })
        var filteredResultsData = Array.from(document.querySelectorAll('.data-filter-column'))
        // for each function with object keys
        Object.keys(selectedFiltersData).forEach(function (value) {
          //     // set value from filter
          var filterValues = selectedFiltersData[value]
          filteredResultsData = filteredResultsData.filter(function (filterableData) {
            var matched = false
            var currentFilterData = Array.from(filterableData.querySelectorAll('.sub-heading'))
            var currentFilterValuesData
            currentFilterData.forEach(function (currentFilterDataItem) {
              var filterSplitValue = currentFilterDataItem.dataset.category.toLowerCase().split(' ')
              currentFilterValuesData = filterSplitValue
            })
            var currentFilterValues = currentFilterValuesData
            Array.prototype.forEach.call(currentFilterValues, function (currentFilterValue) {
              if (filterValues.indexOf(currentFilterValue) !== -1) {
                // console.log('true', currentFilterValue, filterValues)
                matched = true
                return false
              }
            })
            // if matched is true the current .data-filter-column element is returned
            return matched
          }) // filter loop end
        })
        // First hide all data column
        allData.forEach(function (dataColumn) {
          dataColumn.classList.add('hide')
        })
        // display filter result data column
        filteredResultsData.forEach(function (result, idn) {
          result.classList.add('show')
          result.classList.remove('hide')
          if (idn % 2 === 1) {
            result.classList.add('even')
          } else {
            result.classList.add('odd')
          }
        })
        var clearALLBtn = document.getElementById('clearALLBtn')
        clearALLBtn.addEventListener('click', function (event) {
          event.preventDefault()
          selectedFiltersData = []
          // remove all classes
          allData.forEach(function (dataColumn, idx) {
            dataColumn.classList.remove('hide')
            dataColumn.classList.remove('show')
            dataColumn.classList.remove('odd')
            dataColumn.classList.remove('even')
            if (idx % 2 === 1) {
              dataColumn.classList.add('even')
            } else {
              dataColumn.classList.add('odd')
            }
          })

          var inputs = document.querySelectorAll('.check-mark')
          for (var j = 0; j < inputs.length; j++) {
            inputs[j].checked = false
          }
        })
      }) // checkbox click event end
    }) // filterMenuCheckboxes end
  } // if condition end
  /*eslint-env jquery*/
})()
