(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = 'function' == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = 'MODULE_NOT_FOUND'), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t,
        );
      }
      return n[i].exports;
    }
    for (
      var u = 'function' == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.initializeDashboard = initializeDashboard;
        const utils_1 = require('./utils');
        function initializeDashboard() {
          document.addEventListener('DOMContentLoaded', function () {
            (0, utils_1.hideLoading)();
            const deleteUserButtons =
              document.querySelectorAll('.delete-user-btn');
            deleteUserButtons.forEach((button) => {
              button.addEventListener('click', async function () {
                const userId = this.getAttribute('data-user-id');
                const errorMessageElement = document.querySelector(
                  `.error-message[data-user-id="${userId}"]`,
                );
                const successMessageElement = document.querySelector(
                  `.success-message[data-user-id="${userId}"]`,
                );
                if (!errorMessageElement) {
                  console.warn(
                    `Error message element not found for user ID ${userId}`,
                  );
                  return;
                }
                try {
                  (0, utils_1.showLoading)('Deleting User...');
                  (0, utils_1.disableUI)();
                  const response = await fetch(`/dashboard/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                  });
                  if (response.ok) {
                    (0, utils_1.showSuccessMessage)(
                      successMessageElement,
                      'User deleted successfully',
                    );
                    setTimeout(() => location.reload(), 1000);
                  } else {
                    console.error(
                      `Failed request: ${response.status} - ${response.statusText}`,
                    );
                    (0, utils_1.showErrorMessage)(
                      errorMessageElement,
                      'Failed to delete user',
                    );
                  }
                } catch (error) {
                  console.error(error);
                  (0, utils_1.showErrorMessage)(
                    errorMessageElement,
                    'An unexpected error occurred',
                  );
                } finally {
                  (0, utils_1.hideLoading)();
                  (0, utils_1.enableUI)();
                }
              });
            });
            const updateUserForms =
              document.querySelectorAll('.update-user-form');
            updateUserForms.forEach((form) => {
              form.addEventListener('submit', async function (event) {
                event.preventDefault();
                const userId = this.getAttribute('data-user-id');
                const errorMessageElement = document.querySelector(
                  `.error-message[data-user-id="${userId}"]`,
                );
                const successMessageElement = document.querySelector(
                  `.success-message[data-user-id="${userId}"]`,
                );
                if (!errorMessageElement) {
                  console.warn(
                    `Error message element not found for user ID ${userId}`,
                  );
                  return;
                }
                const formData = Object.fromEntries(new FormData(this));
                try {
                  (0, utils_1.showLoading)('Updating User...');
                  (0, utils_1.disableUI)();
                  const response = await fetch(`/dashboard/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                  });
                  if (response.ok) {
                    (0, utils_1.showSuccessMessage)(
                      successMessageElement,
                      'User updated successfully',
                    );
                    setTimeout(() => location.reload(), 1000);
                  } else {
                    console.error(
                      `Failed request: ${response.status} - ${response.statusText}`,
                    );
                    (0, utils_1.showErrorMessage)(
                      errorMessageElement,
                      'Failed to update user',
                    );
                  }
                } catch (error) {
                  console.error(error);
                  (0, utils_1.showErrorMessage)(
                    errorMessageElement,
                    'An unexpected error occurred',
                  );
                } finally {
                  (0, utils_1.hideLoading)();
                  (0, utils_1.enableUI)();
                }
              });
            });
            const showUpdateFormButtons = document.querySelectorAll(
              '.show-update-form-btn',
            );
            showUpdateFormButtons.forEach((button) => {
              button.addEventListener('click', function () {
                const form = (0, utils_1.getAssociatedForm)(button);
                if (!form) return;
                document
                  .querySelectorAll(
                    '.update-user-form, .update-interval-form, .update-goal-form',
                  )
                  .forEach((otherForm) => {
                    otherForm.classList.remove('visible');
                  });
                document
                  .querySelectorAll('.show-update-form-btn')
                  .forEach((otherButton) => {
                    otherButton.style.display = 'inline';
                  });
                const isVisible = form.classList.toggle('visible');
                button.style.display = isVisible ? 'none' : 'inline';
              });
            });
            const createIntervalForm = document.getElementById(
              'create-interval-form',
            );
            createIntervalForm.addEventListener(
              'submit',
              async function (event) {
                event.preventDefault();
                const formData = Object.fromEntries(new FormData(this));
                const errorMessageElement = document.querySelector(
                  '#create-interval-error',
                );
                const successMessageElement = document.querySelector(
                  '#create-interval-success',
                );
                if (!errorMessageElement) {
                  console.warn(
                    'Error message element for creating interval not found',
                  );
                  return;
                }
                try {
                  (0, utils_1.showLoading)('Creating Interval...');
                  (0, utils_1.disableUI)();
                  const response = await fetch('/dashboard/intervals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                  });
                  if (response.ok) {
                    (0, utils_1.showSuccessMessage)(
                      successMessageElement,
                      'Interval created successfully',
                    );
                    setTimeout(() => location.reload(), 1000);
                  } else {
                    (0, utils_1.showErrorMessage)(
                      errorMessageElement,
                      'Failed to create interval',
                    );
                  }
                } catch (error) {
                  console.error(error);
                  (0, utils_1.showErrorMessage)(
                    errorMessageElement,
                    'An unexpected error occurred',
                  );
                } finally {
                  (0, utils_1.hideLoading)();
                  (0, utils_1.enableUI)();
                }
              },
            );
            const deleteIntervalButtons = document.querySelectorAll(
              '.delete-interval-btn',
            );
            deleteIntervalButtons.forEach((button) => {
              button.addEventListener('click', async function () {
                const intervalId = this.getAttribute('data-interval-id');
                const errorMessageElement = document.querySelector(
                  `.error-message[data-interval-id="${intervalId}"]`,
                );
                const successMessageElement = document.querySelector(
                  `.success-message[data-interval-id="${intervalId}"]`,
                );
                if (!errorMessageElement) {
                  console.warn(
                    `Error message element not found for user ID ${intervalId}`,
                  );
                  return;
                }
                try {
                  (0, utils_1.showLoading)('Deleting Interval...');
                  (0, utils_1.disableUI)();
                  const response = await fetch(
                    `/dashboard/intervals/${intervalId}`,
                    {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                    },
                  );
                  if (response.ok) {
                    (0, utils_1.showSuccessMessage)(
                      successMessageElement,
                      'Interval deleted successfully',
                    );
                    setTimeout(() => location.reload(), 1000);
                  } else {
                    (0, utils_1.showErrorMessage)(
                      errorMessageElement,
                      'Failed to delete interval',
                    );
                  }
                } catch (error) {
                  console.error(error);
                  (0, utils_1.showErrorMessage)(
                    errorMessageElement,
                    'An unexpected error occurred',
                  );
                } finally {
                  (0, utils_1.hideLoading)();
                  (0, utils_1.enableUI)();
                }
              });
            });
            const updateIntervalForms = document.querySelectorAll(
              '.update-interval-form',
            );
            updateIntervalForms.forEach((form) => {
              form.addEventListener('submit', async function (event) {
                event.preventDefault();
                const intervalId = this.getAttribute('data-interval-id');
                const errorMessageElement = document.querySelector(
                  `.error-message[data-interval-id="${intervalId}"]`,
                );
                const successMessageElement = document.querySelector(
                  `.success-message[data-interval-id="${intervalId}"]`,
                );
                if (!errorMessageElement) {
                  console.warn(
                    `Error message element not found for user ID ${intervalId}`,
                  );
                  return;
                }
                const formData = Object.fromEntries(new FormData(this));
                try {
                  (0, utils_1.showLoading)('Updating Interval...');
                  (0, utils_1.disableUI)();
                  const response = await fetch(
                    `/dashboard/intervals/${intervalId}`,
                    {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(formData),
                    },
                  );
                  if (response.ok) {
                    (0, utils_1.showSuccessMessage)(
                      successMessageElement,
                      'Interval updated successfully',
                    );
                    setTimeout(() => location.reload(), 1000);
                  } else {
                    (0, utils_1.showErrorMessage)(
                      errorMessageElement,
                      'Failed to update interval',
                    );
                  }
                } catch (error) {
                  console.error('Error:', error);
                  (0, utils_1.showErrorMessage)(
                    errorMessageElement,
                    'An unexpected error occurred',
                  );
                } finally {
                  (0, utils_1.hideLoading)();
                  (0, utils_1.enableUI)();
                }
              });
            });
            const deleteGoalButtons =
              document.querySelectorAll('.delete-goal-btn');
            deleteGoalButtons.forEach((button) => {
              button.addEventListener('click', async function () {
                const goalId = this.getAttribute('data-goal-id');
                const errorMessageElement = document.querySelector(
                  `.error-message[data-goal-id="${goalId}"]`,
                );
                const successMessageElement = document.querySelector(
                  `.success-message[data-goal-id="${goalId}"]`,
                );
                if (!errorMessageElement) {
                  console.warn(
                    `Error message element not found for goal ID ${goalId}`,
                  );
                  return;
                }
                try {
                  (0, utils_1.showLoading)('Deleting Goal...');
                  (0, utils_1.disableUI)();
                  const response = await fetch(`/dashboard/goals/${goalId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                  });
                  if (response.ok) {
                    (0, utils_1.showSuccessMessage)(
                      successMessageElement,
                      'Goal deleted successfully',
                    );
                    setTimeout(() => location.reload(), 1000);
                  } else {
                    (0, utils_1.showErrorMessage)(
                      errorMessageElement,
                      'Failed to delete goal',
                    );
                  }
                } catch (error) {
                  console.error(error);
                  (0, utils_1.showErrorMessage)(
                    errorMessageElement,
                    'An unexpected error occurred',
                  );
                } finally {
                  (0, utils_1.hideLoading)();
                  (0, utils_1.enableUI)();
                }
              });
            });
            const updateGoalForms =
              document.querySelectorAll('.update-goal-form');
            updateGoalForms.forEach((form) => {
              form.addEventListener('submit', async function (event) {
                event.preventDefault();
                const goalId = this.getAttribute('data-goal-id');
                const errorMessageElement = document.querySelector(
                  `.error-message[data-goal-id="${goalId}"]`,
                );
                const successMessageElement = document.querySelector(
                  `.success-message[data-goal-id="${goalId}"]`,
                );
                if (!errorMessageElement) {
                  console.warn(
                    `Error message element not found for goal ID ${goalId}`,
                  );
                  return;
                }
                const formData = Object.fromEntries(new FormData(this));
                try {
                  (0, utils_1.showLoading)('Updating Goal...');
                  (0, utils_1.disableUI)();
                  const response = await fetch(`/dashboard/goals/${goalId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                  });
                  if (response.ok) {
                    (0, utils_1.showSuccessMessage)(
                      successMessageElement,
                      'Goal updated successfully',
                    );
                    setTimeout(() => location.reload(), 1000);
                  } else {
                    (0, utils_1.showErrorMessage)(
                      errorMessageElement,
                      'Failed to update goal',
                    );
                  }
                } catch (error) {
                  console.error(error);
                  (0, utils_1.showErrorMessage)(
                    errorMessageElement,
                    'An unexpected error occurred',
                  );
                } finally {
                  (0, utils_1.hideLoading)();
                  (0, utils_1.enableUI)();
                }
              });
            });
            const createGoalForm = document.getElementById('create-goal-form');
            createGoalForm.addEventListener('submit', async function (event) {
              event.preventDefault();
              const errorMessageElement =
                document.querySelector('#create-goal-error');
              const successMessageElement = document.querySelector(
                '#create-goal-success',
              );
              if (!errorMessageElement) {
                console.warn(
                  'Error message element for creating goal not found',
                );
                return;
              }
              const formData = Object.fromEntries(new FormData(this));
              try {
                (0, utils_1.showLoading)('Creating Goal...');
                (0, utils_1.disableUI)();
                const response = await fetch('/dashboard/goals', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData),
                });
                if (response.ok) {
                  (0, utils_1.showSuccessMessage)(
                    successMessageElement,
                    'Goal created successfully',
                  );
                  setTimeout(() => location.reload(), 1000);
                } else {
                  (0, utils_1.showErrorMessage)(
                    errorMessageElement,
                    'Failed to create goal',
                  );
                }
              } catch (error) {
                console.error(error);
                (0, utils_1.showErrorMessage)(
                  errorMessageElement,
                  'An unexpected error occurred',
                );
              } finally {
                (0, utils_1.hideLoading)();
                (0, utils_1.enableUI)();
              }
            });
            document.querySelectorAll('.dashboard-form').forEach((form) => {
              form.addEventListener('submit', function (event) {
                const inputs = form.querySelectorAll('[required]');
                let allValid = true;
                inputs.forEach((input) => {
                  if (!input.value.trim()) {
                    allValid = false;
                    input.classList.add('dashboard-error');
                    setTimeout(
                      () => input.classList.remove('dashboard-error'),
                      3000,
                    );
                  }
                });
                if (!allValid) {
                  event.preventDefault();
                  alert('Please fill in all required fields.');
                }
              });
            });
          });
        }
        if (typeof window !== 'undefined') {
          window.initializeDashboard = initializeDashboard;
        }
      },
      { './utils': 2 },
    ],
    2: [
      function (require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.showErrorMessage = showErrorMessage;
        exports.showSuccessMessage = showSuccessMessage;
        exports.getAssociatedForm = getAssociatedForm;
        exports.showLoading = showLoading;
        exports.hideLoading = hideLoading;
        exports.disableUI = disableUI;
        exports.enableUI = enableUI;
        function showErrorMessage(element, message) {
          element.textContent = message;
          element.style.display = 'inline';
          setTimeout(() => {
            element.style.display = 'none';
            element.textContent = '';
          }, 5000);
        }
        function showSuccessMessage(element, message) {
          element.textContent = message;
          element.style.display = 'inline';
          setTimeout(() => {
            element.style.display = 'none';
            element.textContent = '';
          }, 5000);
        }
        function getAssociatedForm(button) {
          const type = button.getAttribute('data-type');
          let form = null;
          if (type === 'user') {
            const userId = button.getAttribute('data-user-id');
            form = document.querySelector(
              `.update-user-form[data-user-id="${userId}"]`,
            );
          } else if (type === 'interval') {
            const intervalId = button.getAttribute('data-interval-id');
            form = document.querySelector(
              `.update-interval-form[data-interval-id="${intervalId}"]`,
            );
          } else if (type === 'goal') {
            const goalId = button.getAttribute('data-goal-id');
            form = document.querySelector(
              `.update-goal-form[data-goal-id="${goalId}"]`,
            );
          }
          if (form && form instanceof HTMLElement) {
            return form;
          }
          console.warn('No form found for this button.');
          return null;
        }
        function showLoading(message = 'Loading...') {
          const loadingOverlay = document.querySelector('.loading-overlay');
          if (loadingOverlay) {
            loadingOverlay.textContent = message;
            loadingOverlay.style.display = 'flex';
          } else {
            console.warn('No loading overlay found.');
          }
        }
        function hideLoading(delay = 2000) {
          const loadingOverlay = document.querySelector('.loading-overlay');
          if (loadingOverlay) {
            setTimeout(() => {
              loadingOverlay.style.display = 'none';
            }, delay);
          } else {
            console.warn('No loading overlay found.');
          }
        }
        function disableUI() {
          const elements = document.querySelectorAll('button, input, select');
          elements.forEach((element) => {
            if (
              element instanceof HTMLButtonElement ||
              element instanceof HTMLInputElement ||
              element instanceof HTMLSelectElement
            ) {
              element.disabled = true;
            }
          });
        }
        function enableUI() {
          const elements = document.querySelectorAll('button, input, select');
          elements.forEach((element) => {
            if (
              element instanceof HTMLButtonElement ||
              element instanceof HTMLInputElement ||
              element instanceof HTMLSelectElement
            ) {
              element.disabled = false;
            }
          });
        }
        if (typeof window !== 'undefined') {
          window.showErrorMessage = showErrorMessage;
          window.showSuccessMessage = showSuccessMessage;
          window.getAssociatedForm = getAssociatedForm;
          window.showLoading = showLoading;
          window.hideLoading = hideLoading;
          window.disableUI = disableUI;
          window.enableUI = enableUI;
        }
      },
      {},
    ],
  },
  {},
  [1],
);
