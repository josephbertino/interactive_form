// script.js
//
// Author: Joe Bertino 2020

// Global variables for form elements
const nameField = document.querySelector('input#name');
const emailField = document.querySelector('input#email');
const activitiesBox = document.querySelector('#activities-box');
const activitiesCheckboxes = document.querySelectorAll('#activities-box input[type="checkbox"]');
const selectPayment = document.querySelector('select#payment');

// Credit Card fields
const expMonth = document.querySelector("select#exp-month");
const expYear = document.querySelector("select#exp-year");
const ccNum = document.querySelector("input#cc-num");
const ccZip = document.querySelector("input#zip");
const ccCVV = document.querySelector("input#cvv");

// Reset the form on page load
const form = document.querySelector('form');
form.reset();

//////////////////// BEGIN UTILITY FUNCTIONS ////////////////////
const noDisplay = (elem) => { elem.style.display = 'none'; };

const yesDisplay = (elem) => { elem.style.display = ''; };
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

// 5.1) Disable the "Color" <select> element.
const selectColor = document.querySelector('select#color');
selectColor.disabled = true;

// 5.2) Program the "Design" <select> element to listen for user changes.
const selectDesign = document.querySelector('select#design');
selectDesign.addEventListener('change', (e) => {
  // The "Color" <select> element should be enabled.
  selectColor.disabled = false;
  // The "Color" dropdown menu should display only the color options associated with the selected design.

  // Find out which tshirt design was selected
  var designValue = '';
  [...selectDesign.children].forEach((design, idx) => {
    if (design.selected === true) {
      designValue = design.value;
    }
  });

  [...selectColor.children].forEach((colorOpt, idx) => {
    if (colorOpt.getAttribute('data-theme') === designValue) {
      // console.log('showing');
      // colorOpt.setAttribute('hidden',false);
      colorOpt.hidden = false;
    } else {
      // console.log('hiding');
      // colorOpt.setAttribute('hidden',true);
      colorOpt.hidden = true;
    }
  });

  // The user changed the design selection, so the color options have updated. Thus prompt them to select the color again by resetting the dropdown.
  selectColor.selectedIndex = 0;
});

// 6) The "Total: $" element below the "Register for Activities" section should update to reflect the sum of the cost of the user’s selected activities.
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

// 7.1) When the form first loads, "Credit Card" should be displayed
selectPayment.selectedIndex = 1;

// 7.2) and the credit card payment section should be the only payment section displayed in the form’s UI.

const payPaypal = document.querySelector('div#paypal');
noDisplay(payPaypal);

const payBitcoin = document.querySelector('div#bitcoin');
noDisplay(payBitcoin);

// 7.3)  And when the user selects one of the payment options from the "I'm going to pay with" drop down menu, the form should update to display only the chosen payment method section.
const payOptions = document.querySelectorAll('fieldset.payment-methods > div');

selectPayment.addEventListener('change', (e) => {
  const payMethodSelected = e.target.value;

  [...payOptions].forEach((option, idx) => {
    // Ignoring <div> element with no id because that's the dropdown menu, and I don't want to hide that.
    if (option.className !== "payment-method-box") {
      if (option.id === payMethodSelected) {
        yesDisplay(option);
      } else {
        noDisplay(option);
      }
    }
  });
});

// 8) Users shouldn’t be able to submit a form without the required information, or with invalid information. Create form validation
const nameValidate = () => {
  const name = nameField.value;
  const blankRE = /^\s+$/;
  // The name cannot be empty...
  return (name.length > 0 &&
  // ...or blank (all whitespace)
          !blankRE.test(name));
};

const emailValidate = () => {
  const emailRE = /^[^@]+@[^@.]+\.com$/;
  return emailRE.test(emailField.value);
};

const activitiesValidate = () => {
  [...activitiesCheckboxes].forEach((cb, idx) => {
    if (cb.checked) {
      return true;
    }
  });

  return false;
};

const creditValidate = () => {

  let retval = true;

  if (!cardNumberValidate()) {
    showFormError(ccNum);
    retval = false;
  } else {
    showFormSuccess(ccNum);
  }

  if (!zipCodeValidate()) {
    showFormError(ccZip);
    retval = false;
  } else {
    showFormSuccess(ccZip);
  }

  if (!cvvValidate()) {
    showFormError(ccCVV);
    retval = false;
  } else {
    showFormSuccess(ccCVV);
  }

  if (!expMonthValidate()) {
    showFormError(expMonth);
    retval = false;
  } else {
    showFormSuccess(expMonth);
  }

  if (!expYearValidate()) {
    showFormError(expYear);
    retval = false;
  } else {
    showFormSuccess(expYear);
  }

  return retval;
};

const cardNumberValidate = () => {
  const ccRE = /^\d{13,16}$/;
  return ccRE.test(ccNum.value);
};

const zipCodeValidate = () => {
  const zipRE = /^\d{5}$/;
  return zipRE.test(ccZip.value);
};

const cvvValidate = () => {
  const cvvRE = /^\d{3}$/;
  return cvvRE.test(ccCVV.value);
};

const expMonthValidate = () => {
  return (expMonth.selectedIndex !== 0);
};

const expYearValidate = () => {
  return (expYear.selectedIndex !== 0);
};

const showFormError = (elem) => {
  const elemParent = elem.parentElement;
  elemParent.classList.add('not-valid');
  elemParent.classList.remove('valid');
  elemParent.lastElementChild.style.display='inline';
};

const showFormSuccess = (elem) => {
  const elemParent = elem.parentElement;
  elemParent.classList.add('valid');
  elemParent.classList.remove('not-valid');
  elemParent.lastElementChild.style.display='none';
};

form.addEventListener('submit', (e) => {

  if (!nameValidate()) {
    e.preventDefault();
    showFormError(nameField);
  } else {
    showFormSuccess(nameField);
  }

  if (!emailValidate()) {
    e.preventDefault();
    showFormError(emailField);
  } else {
    showFormSuccess(emailField);
  }

  if (!activitiesValidate()) {
    e.preventDefault();
    showFormError(activitiesBox);
  } else {
    showFormSuccess(activitiesBox);
  }

  if (selectPayment.value === 'credit-card' && !creditValidate()) {
    e.preventDefault();
  }
});

// 9) Make the focus states of the activities more obvious to all users.

// 9.1) Program all of the activity checkbox input elements to listen for the focus and blur events.
activitiesBox.addEventListener('focusin', (e) => {
  const parLabel = e.target.parentElement;
  parLabel.classList.add('focus');
});

activitiesBox.addEventListener('focusout', (e) => {
  const parLabel = e.target.parentElement;
  parLabel.classList.remove('focus');
});
