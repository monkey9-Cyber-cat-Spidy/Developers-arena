const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');
const yearSpan = document.getElementById('year');

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('nav__list--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navList.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navList.classList.remove('nav__list--open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

    let isValid = true;

    function setError(input, message) {
      const group = input.closest('.form-group');
      const errorSpan = group.querySelector('.form-error');
      errorSpan.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    function clearError(input) {
      const group = input.closest('.form-group');
      const errorSpan = group.querySelector('.form-error');
      errorSpan.textContent = '';
      input.removeAttribute('aria-invalid');
    }

    [nameInput, emailInput, messageInput].forEach((input) => {
      if (!input) return;
      clearError(input);
      if (!input.value.trim()) {
        setError(input, 'This field is required');
      }
    });

    if (emailInput && emailInput.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value)) {
        setError(emailInput, 'Please enter a valid email address');
      }
    }

    if (isValid) {
      alert('Thank you! This demo form is valid. You can now hook it to a backend.');
      form.reset();
    }
  });
}
