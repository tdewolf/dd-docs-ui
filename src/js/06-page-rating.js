;
(function ($) {
  'use strict'
  var dialogBox = document.getElementById('dialogBox')
  var helpYesBtn = document.getElementById('yesBtn')
  var helpNoBtn = document.getElementById('noBtn')
  var skipBtnMsg = document.getElementById('skipBtnMsg')
  var feedBackFormBox = document.getElementById('additionalFeedbackBox')
  //  var leaveAddtinalBox = document.getElementById('leaveAddtinalBox')
  // var skipLeaveBtn = document.getElementById('skipLeaveBtn')
  var feedBackMsg = document.querySelector('.feed-back-msg')
  var submitBtn = document.querySelector('.submit-btn')
  // var leaveYesBtn = document.querySelector('.yes-btn')
  var feedbackInfoBtn = document.querySelector('.info-btn')
  var feedbackModal = document.querySelector('.feedback-modal')
  var closeModalPopup = document.querySelector('.close-popup')
  //var anyFeedbackBtn = document.querySelector('.any-feedback-btn')
  // for config
  var yesBtnData = helpYesBtn.dataset
  var noBtnData = helpNoBtn.dataset

  helpYesBtn.addEventListener('click', function (e) {
    // dialogBox.style.display = 'block'
    this.classList.add('active')
    helpNoBtn.classList.remove('active')
    console.log(yesBtnData, 16)
  })
  helpNoBtn.addEventListener('click', function (e) {
    // dialogBox.style.display = 'block'
    this.classList.add('active')
    helpYesBtn.classList.remove('active')
    console.log(noBtnData, 27)
  })

  // anyFeedbackBtn.addEventListener('click', function (e) {
  //   e.preventDefault()
  //   dialogBox.style.display = 'block'
  //   feedBackFormBox.style.display = 'block'
  //   this.classList.add('active')
  // })

  skipBtnMsg.addEventListener('click', function (e) {
    dialogBox.style.display = 'none'
    feedBackMsg.value = ''
  })
  // skipLeaveBtn.addEventListener('click', function (e) {
  //   leaveAddtinalBox.style.display = 'none'
  //   feedBackFormBox.style.display = 'block'
  // })

  feedBackMsg.addEventListener('keyup', function (e) {
    var textareaValue = this.value

    if (textareaValue !== '') {
      submitBtn.classList.remove('disabled')
    } else {
      submitBtn.classList.add('disabled')
    }
  })
  feedbackInfoBtn.addEventListener('click', function (e) {
    feedbackModal.classList.add('show')
  })

  closeModalPopup.addEventListener('click', function (e) {
    feedbackModal.classList.remove('show')
  })
// Requires jQuery!

// $.ajax({

//   url: "https://issues.couchbase.com/s/c388fbe027b748256bfad112765f7a1d-T/-k7v1j/805002/be0e2f3d0946caa44cd62a35c9de2f18/3.1.0/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=709818cb",

//   type: "get",

//   cache: true,

//   dataType: "script"

// });



  window.ATL_JQ_PAGE_PROPS =  {

    "triggerFunction": function(showCollectorDialog) {

          //Requires that jQuery is available!

          $("#myCustomTrigger").click(function(e) {

                e.preventDefault();

                showCollectorDialog();

          });

    }};



})(jQuery)
