(function($) {

  'use strict';

  // for slide toggle
  $( ".nav-link" ).click(function(){
    $(this).toggleClass('active')
    $(this).next('.sub-menu').slideToggle(10)
  })


  // for filter menu
  var $filterCheckboxes = $('input[type="checkbox"]');

  $filterCheckboxes.on('change', function() {

  var selectedFilters = {

  };

   $filterCheckboxes.filter(':checked').each(function() {

    if (!selectedFilters.hasOwnProperty(this.name)) {
      selectedFilters[this.name] = [];
      //console.log(selectedFilters, 23)
    }

    selectedFilters[this.name].push(this.value);
    console.log(selectedFilters, 27)
  });

  // create a collection containing all of the filterable elements
  var $filteredResults = $('.data-filter-column');

  // loop over the selected filter name -> (array) values pairs
  $.each(selectedFilters, function(name, filterValues) {

    // filter each .data-filter-column element
    $filteredResults = $filteredResults.filter(function() {

      var matched = false,
        currentFilterValues = $(this).find('.sub-heading').data('level').split(' ');
       var test = $(this).find('.languages li p').text();
        console.log(currentFilterValues, test, 48);

      // loop over each category value in the current .data-filter-column's data-category
      $.each(currentFilterValues, function(_, currentFilterValue) {
        console.log('enter');

        // if the current category exists in the selected filters array
        // set matched to true, and stop looping. as we're ORing in each
        // set of filters, we only need to match once

        if ($.inArray(currentFilterValue, filterValues) != -1) {
          console.log('true');
          matched = true;
          return false;
        }
      });

      // if matched is true the current .data-filter-column element is returned
      return matched;

    });
  });

  $('.data-filter-column').addClass('hide').filter($filteredResults).addClass('show').removeClass('hide');
    // reset all check mark
    $('#clearALLBtn').click(function(event){
      selectedFilters = [];
      $('.data-filter-column').removeClass('hide')
      var inputs = $('.check-mark')
      for(var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false
      }
    })
});


})(jQuery);
