'use strict';

let counter;

function incrementClick() {
  counter.textContent = Number(counter.textContent) + 1;

  document.cookie = `counter=${counter.textContent}; Expires=${new Date(2019, 12, 31, 23, 59, 59).toUTCString()};`;
}

function decrementClick() {
  if (Number(counter.textContent) > 0) {
    counter.textContent = Number(counter.textContent) - 1;
  }

  document.cookie = `counter=${counter.textContent}; Expires=${new Date(2019, 12, 31, 23, 59, 59).toUTCString()};`;
}

function resetClick() {
  counter.textContent = '0';

  document.cookie = `counter=${counter.textContent}; Expires=${new Date(2019, 12, 31, 23, 59, 59).toUTCString()};`;
}

function init() {
  counter = document.getElementById('counter');

  if (/counter=\d+/.test(document.cookie)) {
    counter.textContent = document.cookie.match(/counter=\d+/)[0].match(/\d+/)[0];
  } else {
    counter.textContent = '0';
  }

  document.getElementById('increment').addEventListener('click', incrementClick);
  document.getElementById('decrement').addEventListener('click', decrementClick);
  document.getElementById('reset').addEventListener('click', resetClick);
}

document.addEventListener('DOMContentLoaded', init);