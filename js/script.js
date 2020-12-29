// script.js
//
// Author: Joe Bertino 2020

// Global variables for form elements
const nameField = document.querySelector('input#name');
const emailField = document.querySelector('input#email');
const activitiesBox = document.querySelector('#activities-box');
const activitiesCheckboxes = document.querySelectorAll('#activities-box input[type="checkbox"]');

// Credit Card input fields
const ccNum = document.querySelector("input#cc-num");
const ccZip = document.querySelector("input#zip");
const ccCVV = document.querySelector("input#cvv");

// Reset the form on page load
const form = document.querySelector('form');
form.reset();

//////////////////// BEGIN UTILITY FUNCTIONS ////////////////////
// Hide the element
const noDisplay = (elem) => { elem.style.display = 'none'; };

// Show the element
const yesDisplay = (elem) => { elem.style.display = ''; };

// Display indicators that form element has invalid input
const showFieldError = (elem) => {
  const elemParent = elem.parentElement;
  elemParent.classList.add('not-valid');
  elemParent.classList.remove('valid');
  elemParent.lastElementChild.style.display='inline';
};

// Display indicators that form element has valid input
const showFieldSuccess = (elem) => {
  const elemParent = elem.parentElement;
  elemParent.classList.add('valid');
  elemParent.classList.remove('not-valid');
  elemParent.lastElementChild.style.display='none';
};
//////////////////// END UTILITY FUNCTIONS //////////////////////


// When the page first loads, the first text field should have the focus state by default
nameField.focus();

// Hide the "text field" with the id of "other-job-role" so it is not displayed when the form first loads.
const otherRoleInputField = document.querySelector('input#other-job-role');
noDisplay(otherRoleInputField);

// Program the "Job Role" <select> element to listen for user changes. When a change is detected, display/hide the "text field" based on the user’s selection in the drop down menu.
const jobRoleSelect = document.querySelector('select#title');
jobRoleSelect.addEventListener('change', (e) => {
  if (e.target.value === 'other') {
    yesDisplay(otherRoleInputField);
  } else {
    noDisplay(otherRoleInputField);
  }
});

//////////////// BEGIN T SHIRT //////////////

// Disable the "Color" <select> element by default
const selectColor = document.querySelector('select#color');
selectColor.disabled = true;

// Program the "Design" <select> element to listen for user changes.
const selectDesign = document.querySelector('select#design');
selectDesign.addEventListener('change', (e) => {
  // The "Color" <select> element should be enabled.
  selectColor.disabled = false;

  // The "Color" dropdown menu should display only the color options associated with the selected design.
  // Find out which tshirt design was selected
  var designValue = selectDesign.selectedOptions[0].value;

  [...selectColor.children].forEach((colorOpt) => {
    if (colorOpt.getAttribute('data-theme') === designValue) {
      colorOpt.hidden = false;
    } else {
      colorOpt.hidden = true;
    }
  });

  // The user changed the design selection, so the color options have updated. Thus prompt them to select the color again by resetting the dropdown.
  selectColor.selectedIndex = 0;
});
//////////////// END T SHIRT //////////////

// The "Total: $" summation element below the "Register for Activities" section should update to reflect the sum cost of the user’s selected activities.
const activities = document.querySelector('fieldset#activities');
const totalString = document.querySelector('p#activities-cost');
let sumTotal = 0;

activities.addEventListener('change', (e) => {
  const cost = parseInt(e.target.getAttribute('data-cost'));
  if (e.target.checked === true) {
    sumTotal += cost;
  } else {
    sumTotal -= cost;
  }

  totalString.innerHTML = `Total: $${sumTotal}`;
});

////////////// BEGIN PAY METHOD /////////////////
const payOptions = document.querySelectorAll('fieldset.payment-methods > div');

const showRelevantPayElements = (payMethod) => {
  /**
   * Hide all pay method elements that don't apply to the selected payment method.
   *
   * @param {string} payMethod  The payment method selected from the <select> element
   *
   */
  [...payOptions].forEach((option) => {
    // Ignoring <div> element with no id because that's the dropdown menu, and I don't want to hide that.
    if (option.className !== "payment-method-box") {
      if (option.id === payMethod) {
        yesDisplay(option);
      } else {
        noDisplay(option);
      }
    }
  });
};

// The credit card payment option should be the default when the page loads, and he credit card payment section should be the only payment section displayed in the form’s UI on page load
const ccOption = document.querySelector('option[value="credit-card"]');
ccOption.selected = true;
showRelevantPayElements(ccOption.value);

// When the user selects one of the payment options from the "I'm going to pay with" drop down menu, the form should update to display only the chosen payment method section.
const selectPayment = document.querySelector('select#payment');
selectPayment.addEventListener('change', (e) => {
  showRelevantPayElements(e.target.value)
});
////////////// END PAY METHOD /////////////////

/////////////// BEGIN FORM VALIDATION /////////////

const nameValidate = () => {
  /**
   * Confirm the name field is not blank or empty
   */
  const name = nameField.value;
  const somethingRE = /\S/;
  return (name.length > 0 &&
          somethingRE.test(name));
};

const emailValidate = () => {
  /**
   * Confirm the email address is kosher.
   * At least one not-@ symbol, followed by '@', followed by at least one not-@ and not-., followed by '.com'
   */
  const emailRE = /^[^@]+@[^@.]+\.com$/;
  return emailRE.test(emailField.value);
};

const activitiesValidate = () => {
  /**
   * Confirm that at least one activities checkbox is checked
   */
  const isChecked = (cb) => cb.checked === true;

  return [...activitiesCheckboxes].some(isChecked);
};

const cardNumberValidate = () => {
  /**
   * CC num should be 13-16 digits, nothing else.
   */
  const ccRE = /^\d{13,16}$/;
  return ccRE.test(ccNum.value);
};

const zipCodeValidate = () => {
  /**
   * CC zip should be 5 digits, nothing else.
   */
  const zipRE = /^\d{5}$/;
  return zipRE.test(ccZip.value);
};

const cvvValidate = () => {
  /**
   * CC cvv should be 3 digits, nothing else.
   */
  const cvvRE = /^\d{3}$/;
  return cvvRE.test(ccCVV.value);
};

const creditValidate = () => {
  /**
   * Validate the credit card entry fields.
   * If any field is invalid, return false to signal to form to prevent default submission behavior.
   * Show form-error or form-success feedback for each each field
   */

  let retval = true;

  if (!cardNumberValidate()) {
    showFieldError(ccNum);
    retval = false;
  } else {
    showFieldSuccess(ccNum);
  }

  if (!zipCodeValidate()) {
    showFieldError(ccZip);
    retval = false;
  } else {
    showFieldSuccess(ccZip);
  }

  if (!cvvValidate()) {
    showFieldError(ccCVV);
    retval = false;
  } else {
    showFieldSuccess(ccCVV);
  }

  return retval;
};

/// Program the form element to listen to the submit event. When the form submission is detected, each required form field or section should be validated to ensure that they have been filled out correctly. If any of the following required fields is not valid, the form’s submission should be prevented.
form.addEventListener('submit', (e) => {

  if (!nameValidate()) {
    e.preventDefault();
    showFieldError(nameField);
  } else {
    showFieldSuccess(nameField);
  }

  if (!emailValidate()) {
    e.preventDefault();
    showFieldError(emailField);
  } else {
    showFieldSuccess(emailField);
  }

  if (!activitiesValidate()) {
    e.preventDefault();
    showFieldError(activitiesBox);
  } else {
    showFieldSuccess(activitiesBox);
  }

  // If the payment method is not "credit-card", the creditValidate() function will not run
  // I let creditValidate() handle the displaying of form errors for CC input fields
  if (selectPayment.value === 'credit-card' && !creditValidate()) {
    e.preventDefault();
  }
});
/////////////// END FORM VALIDATION /////////////

// Program all of the activity checkbox input elements to listen for the focus and blur events.
[...activitiesCheckboxes].forEach((cb) => {
  cb.addEventListener('focus', (e) => {
    const parLabel = e.target.parentElement;
    parLabel.classList.add('focus');
  });

  cb.addEventListener('blur', (e) => {
    const parLabel = e.target.parentElement;
    parLabel.classList.remove('focus');
  });
});
