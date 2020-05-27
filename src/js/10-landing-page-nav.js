(function ($) {
  'use strict'
  // for slide toggle
  alert(33434)
  $('.nav-link').click(function () {
    debugger
    $(this).toggleClass('active')
    $(this).next('.sub-menu').slideToggle(10)
  })
  // add class even odd
  var $allData = $('.data-filter-column')
  for (var i = 0; i < $allData.length; i++) {
    console.log(i, 445, $allData[i])
    if ((i % 2) === 1) {
      $allData[i].classList.add('even')
    } else {
      $allData[i].classList.add('odd')
    }
  }

  // for filter menu
  var $filterMenuCheckboxes = $('input[type="checkbox"]')
  $filterMenuCheckboxes.on('change', function () {
    var selectedFiltersData = {}
    $filterMenuCheckboxes.filter(':checked').each(function () {
      if (!Object.prototype.hasOwnProperty.call(selectedFiltersData, this.name)) {
        selectedFiltersData[this.name] = []
      }
      // console.log(selectedFiltersData, 27)
      selectedFiltersData[this.name].push(this.value.toLowerCase())
    })
    // create a collection containing all of the filterable elements
    var $filteredResultsData = $('.data-filter-column')
    // loop over the selected filter name -> (array) values pairs
    $filteredResultsData.removeClass('even')
    $filteredResultsData.removeClass('odd')
    $.each(selectedFiltersData, function (name, filterValues) {
      // filter each .data-filter-column element
      $filteredResultsData = $filteredResultsData.filter(function () {
        var matched = false
        var currentFilterValues = $(this).find('.sub-heading').data('category').toLowerCase().split(' ')

        $.each(currentFilterValues, function (_, currentFilterValue) {
          //  console.log('enter', currentFilterValues, currentFilterValue)
          if ($.inArray(currentFilterValue, filterValues) !== -1) {
            console.log('true', currentFilterValue, filterValues)
            matched = true
            return false
          }
        })
        // if matched is true the current .data-filter-column element is returned
        return matched
      })
    })

    $('.data-filter-column').addClass('hide').filter($filteredResultsData).addClass('show').removeClass('hide')
    // add class for data-filter-column
    for (var i = 0; i < $filteredResultsData.length; i++) {
      console.log(i, 445, $filteredResultsData[i])
      if ((i % 2) === 1) {
        $filteredResultsData[i].classList.add('even')
      } else {
        $filteredResultsData[i].classList.add('odd')
      }
    }
    // reset all check mark
    $('#clearALLBtn').click(function (event) {
      selectedFiltersData = []
      $('.data-filter-column').removeClass('hide').removeClass('show').removeClass('odd').removeClass('even')
      var inputs = $('.check-mark')
      for (var j = 0; j < inputs.length; j++) {
        inputs[j].checked = false
      }
      for (var i = 0; i < $allData.length; i++) {
        console.log(i, 445, $allData[i])
        // $allData[i].classList.remove('even')
        // $allData[i].classList.remove('odd')
        if ((i % 2) === 1) {
          $allData[i].classList.add('even')
        } else {
          $allData[i].classList.add('odd')
        }
      }
    })
  })
  /*eslint-env jquery*/
})(jQuery)
