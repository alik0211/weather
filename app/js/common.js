(function() {
  'use strict';

  const app = {
    city: undefined,
    spinner: document.querySelector('.loader'),
    dialog: document.querySelector('.dialog'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  document.querySelector('.card__location').addEventListener('click', () => {
    document.getElementById('city').value = app.city;
    app.toggleDialog(true);
  });

  document.getElementById('butSetCity').addEventListener('click', () => {
    app.city = document.getElementById('city').value;
    app.toggleDialog(false);
    app.getForecast(app.city);
    localStorage.city = app.city;
  });

  app.toggleDialog = function(visible) {
    if (visible) {
      app.dialog.classList.add('dialog--open');
    } else {
      app.dialog.classList.remove('dialog--open');
    }
  };

  app.getForecast = function(city) {
    const url = 'https://alik0211.tk/weather0211/forecast.daily.php?city=' +
          city;

    if ('caches' in window) {
      caches.match(url).then(response => {
        if (response) {
          response.json().then(data => app.updateForecast(data));
        }
      });
    }

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.response);
        app.updateForecast(data);
      }
    });
    xhr.open('GET', url);
    xhr.send();
  };

  app.updateForecast = function(data) {
    const list = data.list;
    const current = data.list[0];
    const card = document.querySelector('.card');

    card.querySelector('.card__location').textContent = data.city.name;
    card.querySelector('.card__description').textContent =
      current.weather[0].description;
    card.querySelector('.visual__value').textContent =
      Math.round(current.temp.day);
    card.querySelector('.visual__icon').style.backgroundImage =
      `url("images/${current.weather[0].icon}.svg")`;
    card.querySelector('.description__wind .description__value').textContent =
      Math.round(current.speed);
    card.querySelector('.description__clouds .description__value').textContent =
      current.clouds;

    const nextDays = card.querySelectorAll('.future__oneday');
    let today = new Date();
    today = today.getDay();
    nextDays.forEach(function(nextDay, i) {
      const day = app.daysOfWeek[(i + today) % 7];
      const future = list[++i];

      nextDay.querySelector('.future__date').textContent = day;
      nextDay.querySelector('.future__icon').style.backgroundImage =
        `url("images/${future.weather[0].icon}.svg")`;
      nextDay.querySelector('.future__temp--high .future__value').textContent =
        Math.round(future.temp.max);
      nextDay.querySelector('.future__temp--low .future__value').textContent =
        Math.round(future.temp.min);
    });

    app.spinner.setAttribute('hidden', true);
  };


  app.city = localStorage.city;

  if (app.city === undefined) {
    app.toggleDialog(true);
  } else {
    app.getForecast(app.city);
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => {
        console.log('Service Worker Registered');
      })
      .catch((err) => {
        console.log('Service Worker Filed to Register', err);
      });
  }
})();
