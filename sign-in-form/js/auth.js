'use strict';

const xhrSignIn = new XMLHttpRequest();
xhrSignIn.addEventListener('load', signInResponse);
xhrSignIn.open('POST', 'https://neto-api.herokuapp.com/signin');
xhrSignIn.setRequestHeader('Content-Type', 'application/json');

const xhrSignUp = new XMLHttpRequest();
xhrSignUp.addEventListener('load', signUpResponse);
xhrSignUp.open('POST', 'https://neto-api.herokuapp.com/signup');
xhrSignUp.setRequestHeader('Content-Type', 'application/json');

function signIn(event) {
  xhrSignIn.send(JSON.stringify(new FormData(event.target)));

  event.preventDefault();
}

function signUp(event) {
  xhrSignUp.send(JSON.stringify(new FormData(event.target)));

  event.preventDefault();
}

function signInResponse() {
  if (xhrSignIn.status !== 200) {
    return;
  }

  try {
    var response = JSON.parse(xhrSignIn.response);
  } catch (error) {
    return;
  }

  if (response.hasOwnProperty('error')) {
    document.querySelector('.sign-in-htm').getElementsByTagName('output')[0].value = response.message;
  } else {
    document.querySelector('.sign-in-htm').getElementsByTagName('output')[0].value = `Пользователь ${response.name} успешно авторизован`;
  }
}

function signUpResponse() {
  if (xhrSignUp.status !== 200) {
    return;
  }

  try {
    var response = JSON.parse(xhrSignUp.response);
  } catch (error) {
    return;
  }

  if (response.hasOwnProperty('error')) {
    document.querySelector('.sign-up-htm').getElementsByTagName('output')[0].value = response.message;
  } else {
    document.querySelector('.sign-up-htm').getElementsByTagName('output')[0].value = `Пользователь ${response.name} успешно зарегистрирован`;
  }
}

function init() {
  document.querySelector('.sign-in-htm').addEventListener('submit', signIn);
  document.querySelector('.sign-up-htm').addEventListener('submit', signUp);
}

document.addEventListener('DOMContentLoaded', init);