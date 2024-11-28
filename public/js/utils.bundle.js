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
          setTimeout(function () {
            element.style.display = 'none';
            element.textContent = '';
          }, 5000);
        }
        function showSuccessMessage(element, message) {
          element.textContent = message;
          element.style.display = 'inline';
          setTimeout(function () {
            element.style.display = 'none';
            element.textContent = '';
          }, 5000);
        }
        function getAssociatedForm(button) {
          var type = button.getAttribute('data-type');
          var form = null;
          if (type === 'user') {
            var userId = button.getAttribute('data-user-id');
            form = document.querySelector(
              '.update-user-form[data-user-id="'.concat(userId, '"]'),
            );
          } else if (type === 'interval') {
            var intervalId = button.getAttribute('data-interval-id');
            form = document.querySelector(
              '.update-interval-form[data-interval-id="'.concat(
                intervalId,
                '"]',
              ),
            );
          } else if (type === 'goal') {
            var goalId = button.getAttribute('data-goal-id');
            form = document.querySelector(
              '.update-goal-form[data-goal-id="'.concat(goalId, '"]'),
            );
          }
          if (form && form instanceof HTMLElement) {
            return form;
          }
          console.warn('No form found for this button.');
          return null;
        }
        function showLoading(message) {
          if (message === void 0) {
            message = 'Loading...';
          }
          var loadingOverlay = document.querySelector('.loading-overlay');
          if (loadingOverlay) {
            loadingOverlay.textContent = message;
            loadingOverlay.style.display = 'flex';
          } else {
            console.warn('No loading overlay found.');
          }
        }
        function hideLoading(delay) {
          if (delay === void 0) {
            delay = 2000;
          }
          var loadingOverlay = document.querySelector('.loading-overlay');
          if (loadingOverlay) {
            setTimeout(function () {
              loadingOverlay.style.display = 'none';
            }, delay);
          } else {
            console.warn('No loading overlay found.');
          }
        }
        function disableUI() {
          var elements = document.querySelectorAll('button, input, select');
          elements.forEach(function (element) {
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
          var elements = document.querySelectorAll('button, input, select');
          elements.forEach(function (element) {
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
