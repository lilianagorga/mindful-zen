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

function getAssociatedForm(button: HTMLElement): HTMLElement | null {
  const type = button.getAttribute('data-type');

  let form: Element | null = null;

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
  const loadingOverlay = document.querySelector(
    '.loading-overlay',
  ) as HTMLElement | null;
  if (loadingOverlay) {
    loadingOverlay.textContent = message;
    loadingOverlay.style.display = 'flex';
  } else {
    console.warn('No loading overlay found.');
  }
}

function hideLoading(delay = 2000) {
  const loadingOverlay = document.querySelector(
    '.loading-overlay',
  ) as HTMLElement | null;
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

declare global {
  interface Window {
    showErrorMessage: (element: HTMLElement, message: string) => void;
    showSuccessMessage: (element: HTMLElement, message: string) => void;
    getAssociatedForm: (button: HTMLElement) => HTMLElement | null;
    showLoading: (message?: string) => void;
    hideLoading: (delay?: number) => void;
    disableUI: () => void;
    enableUI: () => void;
  }
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

export {
  showErrorMessage,
  showSuccessMessage,
  getAssociatedForm,
  showLoading,
  hideLoading,
  disableUI,
  enableUI,
};
