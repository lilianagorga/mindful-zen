(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRegister = initializeRegister;
function initializeRegister() {
    axios.defaults.withCredentials = true;
    document
        .getElementById('registerForm')
        .addEventListener('submit', async function (event) {
        event.preventDefault();
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const sourceInput = document.getElementById('source');
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
        }
        catch (error) {
            alert('Registration failed: ' + error.response?.data?.message ||
                'Unknown error');
        }
    });
}
if (typeof window !== 'undefined') {
    window.initializeRegister = initializeRegister;
}

},{}]},{},[1]);
