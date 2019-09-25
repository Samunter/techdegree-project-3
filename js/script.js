//set focus on the first text field
$('#name').focus();

//hide text field for "other" job title
const $otherTitleText = $('#other-title');
$otherTitleText.hide();

//show text field when "other" is selected as job role
$('#title').on('change', function(e) {
  if (e.target.value === 'other') {
    $otherTitleText.show();
  } else {
    $otherTitleText.hide();
  }
});

//create color option for when no theme is selected
const $noThemeColor = $(
  '<option value="select-theme">Please select a T-shirt theme</option>'
);
$('#color').append($noThemeColor);
$('#color option').hide();
$noThemeColor.attr('selected', true);
