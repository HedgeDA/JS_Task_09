'use strict';

const methods = {
  'sign-in-htm': {
    'url': 'https://neto-api.herokuapp.com/signin',
    'callback': signInResponse
  },
  'sign-up-htm': {
    'url': 'https://neto-api.herokuapp.com/signup',
    'callback': signUpResponse
  }
};

function sign(event) {
  event.preventDefault();

  let data = {};
  let formData = new FormData(event.target);
  for (const [key, value] of formData) {
    data[key] = value;
  }

  let method;
  for (let key in methods) {
    if (event.target.classList.contains(key)) {
      method = methods[key];

      break;
    }
  }

  fetch(method.url, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response;
      }

      throw new Error(response.statusText);
    })
    .then((response) => response.json())
    .then((response) => method.callback(response))
    .catch((error) => console.log(`Ошибка добавления в корзину: ${error}`));
}

function signInResponse(response) {
  if (response.hasOwnProperty('error')) {
    document.querySelector('.sign-in-htm').getElementsByTagName('output')[0].value = response.message;
  } else {
    document.querySelector('.sign-in-htm').getElementsByTagName('output')[0].value = `Пользователь ${response.name} успешно авторизован`;
  }
}

function signUpResponse(response) {
  if (response.hasOwnProperty('error')) {
    document.querySelector('.sign-up-htm').getElementsByTagName('output')[0].value = response.message;
  } else {
    document.querySelector('.sign-up-htm').getElementsByTagName('output')[0].value = `Пользователь ${response.name} успешно зарегистрирован`;
  }
}

function init() {
  document.querySelector('.sign-in-htm').addEventListener('submit', sign);
  document.querySelector('.sign-up-htm').addEventListener('submit', sign);
}

document.addEventListener('DOMContentLoaded', init);