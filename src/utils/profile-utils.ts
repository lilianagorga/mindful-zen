import {
  showErrorMessage,
  showSuccessMessage,
  getAssociatedForm,
  showLoading,
  hideLoading,
  disableUI,
  enableUI,
} from './utils';

function initializeProfile() {
  document.addEventListener('DOMContentLoaded', function () {
    hideLoading();
    const updateUserForm = document.querySelector('.update-user-form');
    if (updateUserForm) {
      updateUserForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(this));
        const errorMessageElement = document.getElementById(
          'update-profile-error',
        );
        const successMessageElement = document.getElementById(
          'update-profile-success',
        );

        try {
          showLoading('Updating User...');
          disableUI();
          const response = await fetch(`/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            showSuccessMessage(
              successMessageElement,
              'Profile updated successfully',
            );
            setTimeout(() => location.reload(), 1000);
          } else {
            showErrorMessage(errorMessageElement, 'Failed to update profile');
          }
        } catch (error) {
          console.error('Error:', error);
          showErrorMessage(
            errorMessageElement,
            'An error occurred while updating the profile',
          );
        } finally {
          hideLoading();
          enableUI();
        }
      });
    }
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
    const deleteUserButton = document.querySelector('.delete-user-btn');
    if (deleteUserButton) {
      deleteUserButton.addEventListener('click', async function () {
        this.getAttribute('data-user-id');
        const errorMessageElement = document.getElementById(
          'delete-profile-error',
        );
        const successMessageElement = document.getElementById(
          'delete-profile-success',
        );

        if (!errorMessageElement || !successMessageElement) {
          console.warn(
            'Error or success message element not found for delete profile.',
          );
          return;
        }

        try {
          showLoading('Deleting User...');
          disableUI();
          const response = await fetch(`/profile`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
            showSuccessMessage(
              successMessageElement,
              'Profile deleted successfully',
            );
            setTimeout(() => (window.location.href = '/'), 1000);
          } else {
            showErrorMessage(errorMessageElement, 'Failed to delete profile');
          }
        } catch (error) {
          console.error('Error:', error);
          showErrorMessage(
            errorMessageElement,
            'An error occurred while deleting the profile',
          );
        } finally {
          hideLoading();
          enableUI();
        }
      });
    }
    const createIntervalForm = document.getElementById(
      'create-interval-form-profile',
    );
    if (createIntervalForm) {
      createIntervalForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = Object.fromEntries(
          new FormData(this as HTMLFormElement),
        );
        const errorMessageElement = document.querySelector(
          '#create-profile-interval-error',
        );
        const successMessageElement = document.querySelector(
          '#create-profile-interval-success',
        );
        if (!errorMessageElement) {
          console.warn('Error message element for creating interval not found');
          return;
        }

        try {
          showLoading('Creating Interval...');
          disableUI();
          const response = await fetch('/profile/intervals', {
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
          showErrorMessage(errorMessageElement, 'An error occurred');
        } finally {
          hideLoading();
          enableUI();
        }
      });
    }
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
          const response = await fetch(`/profile/intervals/${intervalId}`, {
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
          console.error('Error:', error);
          showErrorMessage(
            errorMessageElement,
            'An error occurred while deleting the interval',
          );
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
        console.log('Interval ID:', intervalId);

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
          const response = await fetch(`/profile/intervals/${intervalId}`, {
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
          showErrorMessage(
            errorMessageElement,
            'An error occurred while updating the interval',
          );
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
          const response = await fetch(`/profile/goals/${goalId}`, {
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
          const response = await fetch(`/profile/goals/${goalId}`, {
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
          showErrorMessage(errorMessageElement, 'An error occurred');
        } finally {
          hideLoading();
          enableUI();
        }
      });
    });

    const createGoalForm = document.getElementById('create-goal-form-profile');
    createGoalForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const errorMessageElement = document.querySelector(
        '#create-profile-goal-error',
      );
      const successMessageElement = document.querySelector(
        '#create-profile-goal-success',
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
        const response = await fetch('/profile/goals', {
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
        showErrorMessage(errorMessageElement, 'An error occurred');
      } finally {
        hideLoading();
        enableUI();
      }
    });

    document.querySelectorAll('.profile-form').forEach((form) => {
      form.addEventListener('submit', function (event) {
        const inputs = form.querySelectorAll(
          '[required]',
        ) as NodeListOf<HTMLInputElement>;
        let allValid = true;

        inputs.forEach((input) => {
          if (!input.value.trim()) {
            allValid = false;
            input.classList.add('profile-error');
            setTimeout(() => input.classList.remove('profile-error'), 3000);
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
    initializeProfile: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.initializeProfile = initializeProfile;
}

export { initializeProfile };
