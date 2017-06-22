(function() {
  'use strict';

  const app = {
    city: undefined,
    spinner: document.querySelector('.loader'),
    dialog: document.querySelector('.dialog')
  };

  document.querySelector('.card__location').addEventListener('click', () => {
    document.getElementById('city').value = app.city;
    app.toggleDialog(true);
  });

  document.getElementById('butSetCity').addEventListener('click', () => {
    app.city = document.getElementById('city').value;
    app.toggleDialog(false);
    app.getWeather(app.city);
    localStorage.city = app.city;
  });

  app.toggleDialog = function(visible) {
    if (visible) {
      app.dialog.classList.add('dialog--open');
    } else {
      app.dialog.classList.remove('dialog--open');
    }
  };

  app.getWeather = function(city) {
    const url = 'https://alik0211.tk/weather0211/data.php?city=' + city;

    if ('caches' in window) {
      caches.match(url).then(response => {
        if (response) {
          response.json().then(data => app.updateWeather(data));
        }
      });
    }

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.response);
        app.updateWeather(data);
      }
    });
    xhr.open('GET', url);
    xhr.send();
  };

  app.updateWeather = function(data) {
    const card = document.querySelector('.card');

    card.querySelector('.card__location').textContent = data.name;
    card.querySelector('.card__description').textContent =
      data.weather[0].description;

    card.querySelector('.visual__value').textContent =
      Math.round(data.main.temp);
    card.querySelector('.visual__icon').style.backgroundImage =
      `url("images/${data.weather[0].icon}.svg")`;
    card.querySelector('.description__wind .description__value').textContent =
      Math.round(data.wind.speed);
    card.querySelector('.description__clouds .description__value').textContent =
      data.clouds.all;

    app.spinner.setAttribute('hidden', true);
  };


  app.city = localStorage.city;

  if (app.city === undefined) {
    app.toggleDialog(true);
  } else {
    app.getWeather(app.city);
  }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('./sw.js')
  //     .then(() => {
  //       console.log('Service Worker Registered');
  //     })
  //     .catch((err) => {
  //       console.log('Service Worker Filed to Register', err);
  //     });
  // }
})();
