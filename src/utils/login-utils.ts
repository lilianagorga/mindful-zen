function initializeLogin() {
  axios.defaults.withCredentials = true;
  document
    .getElementById('loginForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault();
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById(
        'password',
      ) as HTMLInputElement;
      const data = {
        email: emailInput.value,
        password: passwordInput.value,
      };
      try {
        await axios.post('/login', data, {
          withCredentials: true,
        });
        window.location.href = '/';
      } catch (error) {
        alert('Login failed: ' + error.response.data.message);
      }
    });
}

declare global {
  interface Window {
    initializeLogin: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.initializeLogin = initializeLogin;
}

export { initializeLogin };
