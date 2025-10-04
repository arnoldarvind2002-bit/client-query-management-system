document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form.form');

  // Helper: Show error under input
  function showError(input, message) {
    const box = input.closest('.input-box');
    let error = box.querySelector('.error-message');
    if (!error) {
      error = document.createElement('div');
      error.className = 'error-message';
      box.appendChild(error);
    }
    error.textContent = message;
    error.style.color = '#dc2626';
    error.style.fontSize = '12px';
    error.style.marginTop = '4px';
  }

  // Helper: Clear error for input
  function clearError(input) {
    const box = input.closest('.input-box');
    const error = box.querySelector('.error-message');
    if (error) {
      error.textContent = '';
    }
  }

  // Email regex validation
  function isValidEmail(email) {
    const re =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect inputs
    const emailInput = form.querySelector('input[type="text"][placeholder*="email"]');
    const passwordInput = form.querySelector('input[type="text"][placeholder="Password"]');
    const phoneInput = form.querySelector('input[type="number"][placeholder*="phone"]');
    const birthDateInput = form.querySelector('input[type="date"]');
    const cityInput = form.querySelector('.address input[type="text"]');
    const countrySelect = form.querySelector('.address select');
    const roleInputs = form.querySelectorAll('input[name="gender"]');

    // Clear previous errors
    [emailInput, passwordInput, phoneInput, birthDateInput, cityInput, countrySelect].forEach(clearError);

    let isValid = true;

    // Validate email
    if (!emailInput.value || !isValidEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    // Validate password length
    if (!passwordInput.value || passwordInput.value.length < 8) {
      showError(passwordInput, 'Password must be at least 8 characters');
      isValid = false;
    }

    // Validate phone (basic check)
    if (!phoneInput.value || phoneInput.value.length < 7) {
      showError(phoneInput, 'Enter a valid phone number');
      isValid = false;
    }

    // Validate birthdate
    if (!birthDateInput.value) {
      showError(birthDateInput, 'Birth date is required');
      isValid = false;
    }

    // Validate city
    if (!cityInput.value.trim()) {
      showError(cityInput, 'City is required');
      isValid = false;
    }

    // Validate country
    if (!countrySelect.value) {
      showError(countrySelect, 'Please select a country');
      isValid = false;
    }

    // Validate role selected
    let selectedRole = null;
    for (const roleInput of roleInputs) {
      if (roleInput.checked) {
        selectedRole = roleInput.nextElementSibling.textContent.trim().toLowerCase();
        break;
      }
    }
    if (!selectedRole) {
      alert('Please select a role');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Prepare body to send
    const body = {
      email: emailInput.value.trim(),
      password: passwordInput.value,
      phone: phoneInput.value.trim(),
      birthdate: birthDateInput.value,
      city: cityInput.value.trim(),
      country: countrySelect.value,
      role: selectedRole,
    };

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        alert('Registration successful! Please login.');
        // Optionally redirect to login
        window.location.href = '/login';
      } else {
        alert(result.message || 'Registration failed.');
      }
    } catch (e) {
      console.error('Register error:', e);
      alert('An error occurred, please try again later.');
    }
  });
});
