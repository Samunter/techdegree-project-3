// Ensure the first text field in the app is automatically focused for good user
// experience.
$('#name').focus();

// If the user selects "Other" for their job, we have an input field for them to
// describe that job, but want to hide it otherwise.
const $otherTitleText = $('#other-title');
$otherTitleText.hide();

// When user has not selected a t-shirt theme, no color options are displayed.
// Instead we show a message prompting them to select a theme.
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

// We want to automatically show the credit card payment fields by default, but
// hide the others for good user experience.
$('#payment option[value="Credit Card"]').attr('selected', true);
const $selectOption = $('option[value="select method"]');
const $credit = $('#credit-card');
const $paypal = $('#paypal');
const $bitcoin = $('#bitcoin');
$selectOption.hide();
$credit.show();
$paypal.hide();
$bitcoin.hide();

// We want to be able to refer to whether a field has valid input
const fieldValidity = {
  name: null,
  mail: null,
  activities: null,
  'cc-num': null,
  zip: null,
  cvv: null
};

/********************************************************
 Job Role
 ********************************************************/

// When "other" is selected as a job role, we display an input field so the user
// can describe that job.
$('#title').on('change', function(e) {
  if (e.target.value === 'other') {
    $otherTitleText.show();
  } else {
    $otherTitleText.hide();
  }
});

// Removes "Your Job Role" text when user focuses the input field.
$otherTitleText.on('focus', function(e) {
  e.target.value = '';
});

/********************************************************
 T-Shirt Info
 ********************************************************/

// Only display valid color options for selected theme.
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

// Upon checking/unchecking a checkbox, activities with conflicting times are
// disabled/enabled.
$('.activities').change(function(e) {
  const $clickedActivity = $(e.target);
  const $clickedActivityTime = $clickedActivity.attr('data-day-and-time');

  for (let i = 0; i < $activities.length; i++) {
    const $thisActivity = $activities.eq(i);
    const $thisActivityTime = $thisActivity.attr('data-day-and-time');

    if (
      // current iterated activity and clicked activity's times conflict
      $thisActivityTime === $clickedActivityTime &&
      // current iterated activity is not the clicked activity itself
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

// Tallies cost when an activity is clicked
$('.activities').change(function() {
  totalCost = 0;
  const checked = checkedActivities($activities);
  tallyCost(checked);
});

/********************************************************
 Payment Info
 ********************************************************/

// Shows only the relevant payment div
$('#payment').change(function(e) {
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
 Form Validation
 ********************************************************/

function showFieldAsInvalid(selectorString) {
  $(selectorString).css('border', '2px solid red');
}
function showFieldAsValid(selectorString) {
  $(selectorString).css('border', '2px solid #6F9DDC');
}
function showActivitiesAsInvalid() {
  $('.activities').css('color', 'red');
}
function showActivitiesAsValid() {
  $('.activities').css('color', 'initial');
}

// Checks whether name field contains valid input
// stores that info in the fieldValidity object
function nameValidation() {
  const name = $('#name').val();
  const nameRegex = /^\w[\s\w-]*$/;
  const isNameValid = nameRegex.test(name);
  fieldValidity.name = isNameValid;
  return isNameValid;
}

// On typing, checks validity of name input and applies
// styling to visually indicate when input is valid.
$('#name').keyup(function() {
  nameValidation();
  if (fieldValidity.name) {
    showFieldAsValid('#name');
  }
});

// If a user focuses on the field and then moves past it,
// styling will be applied to visually indicate
// whether their input was valid or not.
$('#name').on('blur', function() {
  if (fieldValidity.name) {
    showFieldAsValid('#name');
  } else {
    showFieldAsInvalid('#name');
  }
});

// Checks whether email field contains valid input
// stores that info in the fieldValidity object
function emailValidation() {
  const email = $('#mail').val();
  const emailRegex = /^[^@]+@[^@.]+\.[a-z]+$/;
  const isEmailValid = emailRegex.test(email);
  fieldValidity.mail = isEmailValid;
  return isEmailValid;
}

// On typing, checks validity of email input and applies
// styling to visually indicate when input is valid.
$('#mail').keyup(function() {
  emailValidation();
  if (fieldValidity.mail) {
    showFieldAsValid('#mail');
  }
});

// If a user focuses on the field and then moves past it, styling will be
// applied to visually indicate whether their input was valid or not.
$('#mail').on('blur', function() {
  if (fieldValidity.mail) {
    showFieldAsValid('#mail');
  } else {
    showFieldAsInvalid('#mail');
  }
});

// Checks that at least one activity has been selected, stores validity info in
// fieldValidity object
function activitiesValidation() {
  const checked = checkedActivities($activities).length;
  let isActivitiesValid;
  if (checked === 0) {
    isActivitiesValid = false;
  } else {
    isActivitiesValid = true;
  }
  fieldValidity.activities = isActivitiesValid;
  return isActivitiesValid;
}

// When a checkbox is clicked, styling is applied to visually indicate whether
// field is valid - user must select at least one activity
$('.activities').change(function() {
  activitiesValidation();
  if (fieldValidity.activities) {
    showActivitiesAsValid();
  } else {
    showActivitiesAsInvalid();
  }
});

// Checks whether credit card number field contains valid input, stores that
// info in the fieldValidity object.
function cardNumberValidation() {
  const cardNumber = $('#cc-num').val();
  const cardNumberRegex = /^\d{13,16}$/;
  const isCardNumberValid = cardNumberRegex.test(cardNumber);
  fieldValidity['cc-num'] = isCardNumberValid;
  return isCardNumberValid;
}

// On typing, checks validity of credit card number input and applies styling to
// visually indicate when input is valid.
$('#cc-num').keyup(function() {
  cardNumberValidation();
  if (fieldValidity['cc-num']) {
    showFieldAsValid('#cc-num');
  }
});

// If a user focuses on the field and then moves past it, styling will be
// applied to visually indicate whether their input was valid or not.
$('#cc-num').on('blur', function() {
  if (fieldValidity['cc-num']) {
    showFieldAsValid('#cc-num');
  } else {
    showFieldAsInvalid('#cc-num');
  }
});

// Checks whether zip code field contains valid input, stores that info in the
// fieldValidity object.
function zipCodeValidation() {
  const zipCode = $('#zip').val();
  const zipCodeRegex = /^\d{5}$/;
  const isZipCodeValid = zipCodeRegex.test(zipCode);
  fieldValidity.zip = isZipCodeValid;
  return isZipCodeValid;
}

// On typing, checks validity of zip code input and applies styling to visually
// indicate when input is valid.
$('#zip').keyup(function() {
  zipCodeValidation();
  if (fieldValidity.zip) {
    showFieldAsValid('#zip');
  }
});

// If a user focuses on the field and then moves past it, styling will be
// applied to visually indicate whether their input was valid or not.
$('#zip').on('blur', function() {
  if (fieldValidity.zip) {
    showFieldAsValid('#zip');
  } else {
    showFieldAsInvalid('#zip');
  }
});

// Checks whether cvv field contains valid input, stores that info in the
// fieldValidity object.
function cvvValidation() {
  const cvv = $('#cvv').val();
  const cvvRegex = /^\d{3}$/;
  const isCvvValid = cvvRegex.test(cvv);
  fieldValidity.cvv = isCvvValid;
  return isCvvValid;
}

// On typing, checks validity of zip code input and applies styling to visually
// indicate when input is valid.
$('#cvv').keyup(function() {
  cvvValidation();
  if (fieldValidity.cvv) {
    showFieldAsValid('#cvv');
  }
});

// If a user focuses on the field and then moves past it, styling will be
// applied to visually indicate whether their input was valid or not.
$('#cvv').on('blur', function() {
  if (fieldValidity.cvv) {
    showFieldAsValid('#cvv');
  } else {
    showFieldAsInvalid('#cvv');
  }
});

// Tells you if the form is valid to submit.
function canSubmitForm() {
  let valid =
    fieldValidity.name && fieldValidity.mail && fieldValidity.activities;

  if ($('#payment option').val() === 'Credit Card') {
    valid =
      valid &&
      fieldValidity['cc-num'] &&
      fieldValidity.zip &&
      fieldValidity.cvv;
  }

  return valid;
}

// Applies styling to fields to visually indicate that input is invalid
function styleFailedFields() {
  for (let fieldName in fieldValidity) {
    if (fieldName === 'activities' && !fieldValidity.activities) {
      showActivitiesAsInvalid();
    } else if (!fieldValidity[fieldName]) {
      showFieldAsInvalid('#' + fieldName);
    }
  }
}

// On submit, if required fields are invalid, prevent form from submitting and
// visually indicate errors
$('form').submit(function(e) {
  if (!canSubmitForm()) {
    e.preventDefault();
    styleFailedFields();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
