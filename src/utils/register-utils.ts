function initializeRegister() {
  axios.defaults.withCredentials = true;

  document
    .getElementById('registerForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault();
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById(
        'password',
      ) as HTMLInputElement;
      const firstNameInput = document.getElementById(
        'firstName',
      ) as HTMLInputElement;
      const lastNameInput = document.getElementById(
        'lastName',
      ) as HTMLInputElement;
      const sourceInput = document.getElementById('source') as HTMLInputElement;

      const data = {
        email: emailInput.value,
        password: passwordInput.value,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        source: sourceInput.value,
      };

      try {
        await axios.post('/register', data, { withCredentials: true });
        window.location.href = '/login';
      } catch (error) {
        alert(
          'Registration failed: ' + error.response?.data?.message ||
            'Unknown error',
        );
      }
    });
}

declare global {
  interface Window {
    initializeRegister: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.initializeRegister = initializeRegister;
}

export { initializeRegister };
