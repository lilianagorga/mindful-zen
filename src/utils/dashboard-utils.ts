import {
  showErrorMessage,
  showSuccessMessage,
  getAssociatedForm,
  showLoading,
  hideLoading,
  disableUI,
  enableUI,
} from './utils';

function initializeDashboard() {
  document.addEventListener('DOMContentLoaded', function () {
    hideLoading();
    const deleteUserButtons = document.querySelectorAll('.delete-user-btn');
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
          console.warn(`Error message element not found for user ID ${userId}`);
          return;
        }
        try {
          showLoading('Deleting User...');
          disableUI();
          const response = await fetch(`/dashboard/${userId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
            showSuccessMessage(
              successMessageElement,
              'User deleted successfully',
            );
            setTimeout(() => location.reload(), 1000);
          } else {
            console.error(
              `Failed request: ${response.status} - ${response.statusText}`,
            );
            showErrorMessage(errorMessageElement, 'Failed to delete user');
          }
        } catch (error) {
          console.error(error);
          showErrorMessage(errorMessageElement, 'An unexpected error occurred');
        } finally {
          hideLoading();
          enableUI();
        }
      });
    });
    const updateUserForms = document.querySelectorAll('.update-user-form');
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
          console.warn(`Error message element not found for user ID ${userId}`);
          return;
        }
        const formData = Object.fromEntries(new FormData(this));

        try {
          showLoading('Updating User...');
          disableUI();
          const response = await fetch(`/dashboard/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            showSuccessMessage(
              successMessageElement,
              'User updated successfully',
            );
            setTimeout(() => location.reload(), 1000);
          } else {
            console.error(
              `Failed request: ${response.status} - ${response.statusText}`,
            );
            showErrorMessage(errorMessageElement, 'Failed to update user');
          }
        } catch (error) {
          console.error(error);
          showErrorMessage(errorMessageElement, 'An unexpected error occurred');
        } finally {
          hideLoading();
          enableUI();
        }
      });
    });
    const showUpdateFormButtons = document.querySelectorAll(
      '.show-update-form-btn',
    );
    showUpdateFormButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const form = getAssociatedForm(button as HTMLElement);
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
            (otherButton as HTMLButtonElement).style.display = 'inline';
          });
        const isVisible = form.classList.toggle('visible');
        (button as HTMLButtonElement).style.display = isVisible
          ? 'none'
          : 'inline';
      });
    });

    const createIntervalForm = document.getElementById('create-interval-form');
    createIntervalForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const formData = Object.fromEntries(
        new FormData(this as HTMLFormElement),
      );
      const errorMessageElement = document.querySelector(
        '#create-interval-error',
      );
      const successMessageElement = document.querySelector(
        '#create-interval-success',
      );
      if (!errorMessageElement) {
        console.warn('Error message element for creating interval not found');
        return;
      }
      try {
        showLoading('Creating Interval...');
        disableUI();
        const response = await fetch('/dashboard/intervals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          showSuccessMessage(
            successMessageElement,
            'Interval created successfully',
          );
          setTimeout(() => location.reload(), 1000);
        } else {
          showErrorMessage(errorMessageElement, 'Failed to create interval');
        }
      } catch (error) {
        console.error(error);
        showErrorMessage(errorMessageElement, 'An unexpected error occurred');
      } finally {
        hideLoading();
        enableUI();
      }
    });
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
          showLoading('Deleting Interval...');
          disableUI();
          const response = await fetch(`/dashboard/intervals/${intervalId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
            showSuccessMessage(
              successMessageElement,
              'Interval deleted successfully',
            );
            setTimeout(() => location.reload(), 1000);
          } else {
            showErrorMessage(errorMessageElement, 'Failed to delete interval');
          }
        } catch (error) {
          console.error(error);
          showErrorMessage(errorMessageElement, 'An unexpected error occurred');
        } finally {
          hideLoading();
          enableUI();
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
          showLoading('Updating Interval...');
          disableUI();
          const response = await fetch(`/dashboard/intervals/${intervalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            showSuccessMessage(
              successMessageElement,
              'Interval updated successfully',
            );
            setTimeout(() => location.reload(), 1000);
          } else {
            showErrorMessage(errorMessageElement, 'Failed to update interval');
          }
        } catch (error) {
          console.error('Error:', error);
          showErrorMessage(errorMessageElement, 'An unexpected error occurred');
        } finally {
          hideLoading();
          enableUI();
        }
      });
    });
    const deleteGoalButtons = document.querySelectorAll('.delete-goal-btn');
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
          console.warn(`Error message element not found for goal ID ${goalId}`);
          return;
        }

        try {
          showLoading('Deleting Goal...');
          disableUI();
          const response = await fetch(`/dashboard/goals/${goalId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
            showSuccessMessage(
              successMessageElement,
              'Goal deleted successfully',
            );
            setTimeout(() => location.reload(), 1000);
          } else {
            showErrorMessage(errorMessageElement, 'Failed to delete goal');
          }
        } catch (error) {
          console.error(error);
          showErrorMessage(errorMessageElement, 'An unexpected error occurred');
        } finally {
          hideLoading();
          enableUI();
        }
      });
    });
    const updateGoalForms = document.querySelectorAll('.update-goal-form');
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
          console.warn(`Error message element not found for goal ID ${goalId}`);
          return;
        }
        const formData = Object.fromEntries(new FormData(this));

        try {
          showLoading('Updating Goal...');
          disableUI();
          const response = await fetch(`/dashboard/goals/${goalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            showSuccessMessage(
              successMessageElement,
              'Goal updated successfully',
            );
            setTimeout(() => location.reload(), 1000);
          } else {
            showErrorMessage(errorMessageElement, 'Failed to update goal');
          }
        } catch (error) {
          console.error(error);
          showErrorMessage(errorMessageElement, 'An unexpected error occurred');
        } finally {
          hideLoading();
          enableUI();
        }
      });
    });
    const createGoalForm = document.getElementById('create-goal-form');
    createGoalForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const errorMessageElement = document.querySelector('#create-goal-error');
      const successMessageElement = document.querySelector(
        '#create-goal-success',
      );
      if (!errorMessageElement) {
        console.warn('Error message element for creating goal not found');
        return;
      }
      const formData = Object.fromEntries(
        new FormData(this as HTMLFormElement),
      );

      try {
        showLoading('Creating Goal...');
        disableUI();
        const response = await fetch('/dashboard/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          showSuccessMessage(
            successMessageElement,
            'Goal created successfully',
          );
          setTimeout(() => location.reload(), 1000);
        } else {
          showErrorMessage(errorMessageElement, 'Failed to create goal');
        }
      } catch (error) {
        console.error(error);
        showErrorMessage(errorMessageElement, 'An unexpected error occurred');
      } finally {
        hideLoading();
        enableUI();
      }
    });
    document.querySelectorAll('.dashboard-form').forEach((form) => {
      form.addEventListener('submit', function (event) {
        const inputs = form.querySelectorAll(
          '[required]',
        ) as NodeListOf<HTMLInputElement>;
        let allValid = true;

        inputs.forEach((input) => {
          if (!input.value.trim()) {
            allValid = false;
            input.classList.add('dashboard-error');
            setTimeout(() => input.classList.remove('dashboard-error'), 3000);
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

declare global {
  interface Window {
    initializeDashboard: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.initializeDashboard = initializeDashboard;
}

export { initializeDashboard };
