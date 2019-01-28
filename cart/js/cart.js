'use strict';

let colorSwatch;
const xhrColors = new XMLHttpRequest();
xhrColors.addEventListener("load", onLoadColors);
xhrColors.open("GET", 'https://neto-api.herokuapp.com/cart/colors', true);

let sizeSwatch;
const xhrSizes = new XMLHttpRequest();
xhrSizes.addEventListener("load", onLoadSizes);
xhrSizes.open("GET", 'https://neto-api.herokuapp.com/cart/sizes', true);

let quickCart;
const xhrCart = new XMLHttpRequest();
xhrCart.addEventListener("load", onLoadCart);
xhrCart.open("GET", 'https://neto-api.herokuapp.com/cart', true);

function colorSwatchClick(event) {
  localStorage.setItem('checkedColor', event.target.value)
}

function onLoadColors() {
  if (xhrColors.status !== 200) {
    return;
  }

  let colors;

  try {
    colors = JSON.parse(xhrColors.responseText);
  } catch (error) {
    return;
  }

  let checkedColor = localStorage.getItem('checkedColor');

  colorSwatch.innerHTML = colors.reduce((innerHTML, item) => {
    return innerHTML +
      `<div data-value="${item.code}" class="swatch-element color ${item.code} ${item.isAvailable ? 'available' : 'soldout'}">\
        <div class="tooltip">${item.title}</div>\
        <input quickbeam="color" id="swatch-1-${item.code}" type="radio" name="color" value="${item.code}" ${checkedColor === item.code ? 'checked': ''} ${!item.isAvailable ? 'disabled' : ''}>\
        <label for="swatch-1-${item.code}" style="border-color: ${item.code};">\
          <span style="background-color: ${item.type};"></span>\
          <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">\
        </label>\
      </div>`
  }, '');

  for (let input of document.getElementById('colorSwatch').getElementsByTagName('input')) {
    input.addEventListener('click', colorSwatchClick);
  }
}

function loadColors() {
  colorSwatch = document.getElementById('colorSwatch');
  colorSwatch.innerHTML = '<div class="header">загрузка...</div>';

  xhrColors.send();
}

function sizeSwatchClick(event) {
  localStorage.setItem('checkedSize', event.target.value)
}

function onLoadSizes() {
  if (xhrSizes.status !== 200) {
    return;
  }

  let sizes;

  try {
    sizes = JSON.parse(xhrSizes.responseText);
  } catch (error) {
    return;
  }

  let checkedSize = localStorage.getItem('checkedSize');

  sizeSwatch.innerHTML = sizes.reduce((innerHTML, item) => {
    return innerHTML +
      `<div data-value="${item.title}" class="swatch-element plain ${item.title} ${item.isAvailable ? 'available' : 'soldout'}">\
        <input id="swatch-0-${item.title}" type="radio" name="size" value="${item.title}" ${checkedSize === item.title ? 'checked': ''} ${!item.isAvailable ? 'disabled' : ''}>\
        <label for="swatch-0-${item.title}">\
          ${item.type}\
          <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">\
        </label>\
      </div>`
  }, '');

  for (let input of document.getElementById('sizeSwatch').getElementsByTagName('input')) {
    input.addEventListener('click', sizeSwatchClick);
  }
}

function loadSizes() {
  sizeSwatch = document.getElementById('sizeSwatch');
  sizeSwatch.innerHTML = '<div class="header">загрузка...</div>';

  xhrSizes.send();
}

function onLoadCart() {
  if (xhrCart.status !== 200) {
    return;
  }

  let products;

  try {
    products = JSON.parse(xhrCart.responseText);
  } catch (error) {
    return;
  }

  upgradeCart(products);
}

function upgradeCart(products) {
  let total = 0;

  quickCart.innerHTML = products.reduce((innerHTML, item) => {
    total += (item.price * item.quantity);

    return innerHTML +
      `<div class="quick-cart-product quick-cart-product-static" id="quick-cart-product-${item.id}" style="opacity: 1;">\
        <div class="quick-cart-product-wrap">\
          <img src="${item.pic}" title="${item.title}">\
          <span class="s1" style="background-color: #000; opacity: .5">$800.00</span>\
          <span class="s2"></span>\
        </div>\
        <span class="count hide fadeUp" id="quick-cart-product-count-${item.id}">${item.quantity}</span>\
        <span class="quick-cart-product-remove remove" data-id="${item.id}"></span>\
      </div>`
  }, '');

  quickCart.innerHTML +=
  `<a id="quick-cart-pay" quickbeam="cart-pay" class="cart-ico ${products.length > 0 ? 'open' : ''}">\
    <span>\
      <strong class="quick-cart-text">Оформить заказ<br></strong>\
      <span id="quick-cart-price">$${total}</span>\
    </span>\
  </a>`;

  document.querySelectorAll('.quick-cart-product-remove').forEach((span) => {
      span.addEventListener('click', removeFromCart);
    }
  );
}

function loadCart() {
  quickCart = document.getElementById('quick-cart');
  quickCart.innerHTML = 'загрузка...';

  xhrCart.send();
}

function addToCart(event) {
  let formData = new FormData(event.target);
  formData.append('productId', event.target.dataset.productId);

  fetch('https://neto-api.herokuapp.com/cart', {
    body: formData,
    method: 'POST'
  })
    .then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response;
      }

      throw new Error(response.statusText);
    })
    .then((response) => response.json())
    .then((response) => upgradeCart(response))
    .catch((error) => console.log(`Ошибка добавления в корзину: ${error}`));

  event.preventDefault();
}

function removeFromCart(event) {
  let formData = new FormData();
  formData.append('productId', event.target.dataset.id);

  fetch('https://neto-api.herokuapp.com/cart/remove', {
    body: formData,
    method: 'POST'
  })
    .then((response) => {
      if (200 <= response.status && response.status < 300) {
        return response;
      }

      throw new Error(response.statusText);
    })
    .then((response) => response.json())
    .then((response) => upgradeCart(response))
    .catch((error) => console.log(`Ошибка удаления из корзины: ${error}`));

  event.preventDefault();
}

function init() {
  loadColors();

  loadSizes();

  loadCart();

  document.getElementById('AddToCartForm').addEventListener('submit', addToCart);
}

document.addEventListener('DOMContentLoaded', init);