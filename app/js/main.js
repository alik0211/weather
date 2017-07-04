(function() {
  'use strict';

  const app = {
    city: undefined,
    data: null,
    card: document.querySelector('.card'),
    dialog: document.querySelector('.dialog'),
    spinner: document.querySelector('.loader'),
    nextDays: document.querySelectorAll('.future__oneday'),
    selectedDay: document.querySelector('.future__oneday--selected'),
    cityElement: document.getElementById('city'),
    daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  };

  app.card.querySelector('.card__location').addEventListener('click', () => {
    app.cityElement.value = app.city;
    app.toggleDialog(true);
  });

  document.getElementById('butSetCity').addEventListener('click', () => {
    app.city = app.cityElement.value;
    app.toggleDialog(false);
    app.getForecast(app.city);
    localStorage.city = app.city;
  });

  app.nextDays.forEach(day => {
    day.addEventListener('click', e => {
      e.path.forEach(element => {
        if (element.className === 'future__oneday') {
          app.selectedDay.classList.remove('future__oneday--selected');
          element.classList.add('future__oneday--selected');
          app.selectedDay = element;

          return app.setDay(element.getAttribute('data-day-id'));
        }
      });
    });
  });

  app.toggleDialog = function(visible) {
    if (visible) {
      app.dialog.classList.add('dialog--open');
      app.cityElement.focus();
    } else {
      app.dialog.classList.remove('dialog--open');
    }
  };

  app.getForecast = function(city) {
    const url =
      `https://alik0211.tk/weather0211/forecast.daily.php?city=${city}`;

    if ('caches' in window) {
      caches.match(url).then(response => {
        if (response !== undefined) {
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
    app.data = data;
    const card = app.card;

    card.querySelector('.card__location').textContent = data.city.name;

    const nextDays = card.querySelectorAll('.future__oneday');
    let today = new Date();
    today = today.getDay();

    nextDays.forEach(function(nextDay, i) {
      const day = app.daysOfWeek[(i + today) % 7];
      const future = data.list[i];

      nextDay.setAttribute('data-day-id', i);
      nextDay.querySelector('.future__date').textContent = day;
      nextDay.querySelector('.future__icon').style.backgroundImage =
        `url("images/${future.weather[0].icon}.svg")`;
      nextDay.querySelector('.future__temp--high .future__value').textContent =
        Math.round(future.temp.max);
      nextDay.querySelector('.future__temp--low .future__value').textContent =
        Math.round(future.temp.min);
    });

    app.setDay(0);

    app.spinner.setAttribute('hidden', true);
  };

  app.setDay = function(dayId) {
    const current = app.data.list[dayId];
    const card = app.card;

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
      .catch(err => {
        console.log('Service Worker Filed to Register', err);
      });
  }
})();
