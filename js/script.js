const fieldValidity = {
  name: null,
  email: null
};

// Ensure the first text field in the app is automatically
// focused for good user experience.
$('#name').focus();

// If the user selects "Other" for their job, we have
// an input field for them to describe that job, but want to
// hide it otherwise.
const $otherTitleText = $('#other-title');
$otherTitleText.hide();

// When user has not selected a t-shirt theme, no color options
// are displayed. Instead we show a message prompting them to
// select a theme.
const $noThemeColor = $(
  '<option value="select-theme">Please select a T-shirt theme</option>'
);
$('#color option').hide();
$('#color').prepend($noThemeColor);
$noThemeColor.attr('selected', true);

const $activities = $('.activities input');

// Create area to display total cost of all selected activities.
let totalCost = 0;
const $totalDisplay = $('<div></div>');
$totalDisplay.html('Total: $' + totalCost);
$('.activities').append($totalDisplay);

// We want to automatically show the credit card payment fields
// by default, but hide the others for good user experience.
const $credit = $('#credit-card');
const $paypal = $('#paypal');
const $bitcoin = $('#bitcoin');
$credit.show();
$paypal.hide();
$bitcoin.hide();

/********************************************************
 Job Role
 ********************************************************/

// When "other" is selected as a job role, we display an
// input field so the user can describe that job
$('#title').on('change', function(e) {
  if (e.target.value === 'other') {
    $otherTitleText.show();
  } else {
    $otherTitleText.hide();
  }
});

/********************************************************
 T-Shirt Info
 ********************************************************/

// only display valid color options for selected theme
$('#design').change(function(e) {
  const $cornflowerBlue = $('option[value="cornflowerblue"]');
  const $darkSlateGrey = $('option[value="darkslategrey"]');
  const $gold = $('option[value="gold"]');
  const $tomato = $('option[value="tomato"]');
  const $steelBlue = $('option[value="steelblue"]');
  const $dimGrey = $('option[value="dimgrey"]');
  $('#design option')
    .eq(0)
    .hide();
  if (e.target.value === 'js puns') {
    $tomato.hide().attr('selected', false);
    $steelBlue.hide();
    $dimGrey.hide();
    $noThemeColor.hide().attr('selected', false);
    $cornflowerBlue.show().attr('selected', true); // Default value
    $darkSlateGrey.show();
    $gold.show();
  } else if (e.target.value === 'heart js') {
    $cornflowerBlue.hide().attr('selected', false);
    $darkSlateGrey.hide();
    $gold.hide();
    $noThemeColor.hide().attr('selected, false');
    $tomato.show().attr('selected', true); // Default value
    $steelBlue.show();
    $dimGrey.show();
  }
});

/********************************************************
 Register for Activities
 ********************************************************/

//upon checking/unchecking a checkbox,
//activities with conflicting times are disabled/enabled
$('.activities').change(function(e) {
  const $clickedActivity = $(e.target);
  const $clickedActivityTime = $(e.target).attr('data-day-and-time');
  for (let i = 0; i < $activities.length; i++) {
    const $thisActivity = $activities.eq(i);
    const $thisActivityTime = $thisActivity.attr('data-day-and-time');
    if (
      //current iterated activity and clicked activity's times conflict
      $thisActivityTime === $clickedActivityTime &&
      //current iterated activity is not the clicked activity itself
      $thisActivity.attr('name') !== $clickedActivity.attr('name')
    ) {
      if ($clickedActivity.prop('checked')) {
        $thisActivity.attr('disabled', true);
        $thisActivity.parent().css('text-decoration', 'line-through');
      } else {
        $thisActivity.attr('disabled', false);
        $thisActivity.parent().css('text-decoration', 'initial');
      }
    }
  }
});

// Takes a collection and returns all elements that are checked.
function checkedActivities(allElements) {
  const checked = [];
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    if (element.checked) {
      checked.push(element);
    }
  }
  return checked;
}

// Adds the cost of all selected activities to totalCost
function tallyCost(checkedActivities) {
  for (let i = 0; i < checkedActivities.length; i++) {
    const dataCost = checkedActivities[i].dataset.cost;
    const cost = parseInt(dataCost.slice(1));
    totalCost += cost;
  }
  $totalDisplay.html('Total: $' + totalCost);
}

$('.activities').change(function() {
  totalCost = 0;
  const checked = checkedActivities($activities);
  tallyCost(checked);
});

/********************************************************
 Payment Info
 ********************************************************/

$('#payment').change(function(e) {
  const $selectOption = $('option[value="select method"]');
  $selectOption.hide();
  if (e.target.value === 'Credit Card') {
    $credit.show();
    $paypal.hide();
    $bitcoin.hide();
  } else if (e.target.value === 'PayPal') {
    $paypal.show();
    $credit.hide();
    $bitcoin.hide();
  } else if (e.target.value === 'Bitcoin') {
    $bitcoin.show();
    $credit.hide();
    $paypal.hide();
  }
});

/********************************************************
 Payment Info
 ********************************************************/

//create validation functions for each field
//name field can't be blank

$('#name').keyup(function() {
  nameValidation();
  if (fieldValidity.name) {
    showFieldAsValid('#name');
  }
});

$('#name').on('blur', function() {
  if (fieldValidity.name) {
    showFieldAsValid('#name');
  } else {
    showFieldAsInvalid('#name');
  }
});

function nameValidation() {
  const name = $('#name').val();
  console.log(name);
  const nameRegex = /^\w[\s\w-]*$/;
  console.log('name regex test', nameRegex.test(name));
  const isNameValid = nameRegex.test(name);
  fieldValidity.name = isNameValid;
  return isNameValid;
}

//email must be validly formatted

$('#mail').keyup(function() {
  emailValidation();
  if (fieldValidity.email) {
    showFieldAsValid('#mail');
  }
});

$('#mail').on('blur', function() {
  if (fieldValidity.email) {
    showFieldAsValid('#mail');
  } else {
    showFieldAsInvalid('#mail');
  }
});

function emailValidation() {
  const email = $('#mail').val();
  console.log(email);
  const emailRegex = /^[^@]+@[^@.]+\.[a-z]+$/;
  console.log('email regex test', emailRegex.test(email));
  const isEmailValid = emailRegex.test(email);
  fieldValidity.email = isEmailValid;
  return isEmailValid;
}

//must check at least one checkbox in activities
//if credit card
//card # must be 13-16 digits
//zip code must be 5 digits
//cvv must be 3 digits
//if valid return true
//if invalid return false and visually indicate error
function showFieldAsInvalid(selectorString) {
  $(selectorString).css('border', '2px solid red');
}
function showFieldAsValid(selectorString) {
  $(selectorString).css('border', '2px solid #6F9DDC');
}
function showActivitiesAsInvalid() {
  $('.activities').css('color', 'red');
}
function showActivitiesAsInvalid() {
  $('.activities').css('color', 'initial');
}
//create submit event listener and call all functions
