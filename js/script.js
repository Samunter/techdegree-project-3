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
$('#color option').hide();
$('#color').prepend($noThemeColor);
$noThemeColor.attr('selected', true);

//only display valid color options for selected theme
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
