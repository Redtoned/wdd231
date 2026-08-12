document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initContactForm();
});

function initMobileNav() {
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (event) {
    var clickedInsideNav = nav.contains(event.target) || toggle.contains(event.target);
    if (!clickedInsideNav) closeMenu();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) closeMenu();
  });
}

function initContactForm() {
  var form = document.getElementById('consult-form');
  if (!form) return;

  var successPanel = document.getElementById('success-panel');
  var contactMethodLabels = {
    email: 'email',
    phone: 'a phone call',
    text: 'text message'
  };

  var validators = {
    firstname: function (value) {
      return value.trim().length > 0;
    },
    lastname: function (value) {
      return value.trim().length > 0;
    },
    email: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    },
    phone: function (value) {
      if (value.trim() === '') return true;
      return /^[\d()+\-.\s]{7,}$/.test(value.trim());
    }
  };

  function setFieldValidity(fieldId, isValid) {
    var field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.toggle('invalid', !isValid);
  }

  function validateForm() {
    var fields = ['firstname', 'lastname', 'email', 'phone'];
    var isFormValid = true;
    var firstInvalidInput = null;

    fields.forEach(function (name) {
      var input = form.elements[name];
      var isValid = validators[name](input.value);
      setFieldValidity('field-' + name, isValid);
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidInput) firstInvalidInput = input;
      }
    });

    if (!isFormValid && firstInvalidInput) {
      firstInvalidInput.focus();
    }

    return isFormValid;
  }

  var hasAttemptedSubmit = false;
  ['firstname', 'lastname', 'email', 'phone'].forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    input.addEventListener('blur', function () {
      if (hasAttemptedSubmit) {
        setFieldValidity('field-' + name, validators[name](input.value));
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hasAttemptedSubmit = true;

    if (!validateForm()) return;

    var preferredMethodInput = form.querySelector('input[name="contact-method"]:checked');
    var preferredMethod = preferredMethodInput
      ? contactMethodLabels[preferredMethodInput.value]
      : 'email';

    var successMessage = successPanel.querySelector('p');
    if (successMessage) {
      successMessage.textContent =
        "Thanks — a member of our team will reach out within one business day using " +
        preferredMethod + '.';
    }

    form.style.display = 'none';
    successPanel.style.display = 'block';
    successPanel.setAttribute('tabindex', '-1');
    successPanel.focus();
  });
}
