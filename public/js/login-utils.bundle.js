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
        exports.initializeLogin = initializeLogin;
        function initializeLogin() {
          axios.defaults.withCredentials = true;
          document
            .getElementById('loginForm')
            .addEventListener('submit', async function (event) {
              event.preventDefault();
              const emailInput = document.getElementById('email');
              const passwordInput = document.getElementById('password');
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
        if (typeof window !== 'undefined') {
          window.initializeLogin = initializeLogin;
        }
      },
      {},
    ],
  },
  {},
  [1],
);
