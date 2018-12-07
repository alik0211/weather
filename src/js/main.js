'use strict';

const app = {};
app.city = undefined;
app.data = null;
app.card = document.querySelector('.card');
app.dialog = document.querySelector('.dialog');
app.spinner = document.querySelector('.loader');
app.nextDays = app.card.querySelectorAll('.future__oneday');
app.selectedDay = app.card.querySelector('.future__oneday--selected');
app.cityElement = app.dialog.querySelector('.textfield__input');
app.daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

app.card.querySelector('.card__location').addEventListener('click', () => {
  app.cityElement.value = app.city;
  app.toggleDialog();
});

app.dialog.querySelector('.dialog__surface').addEventListener('submit', () => {
  app.city = app.cityElement.value;
  app.toggleDialog();
  app.getForecast(app.city);
  localStorage.city = app.city;
});

app.nextDays.forEach(day => {
  day.addEventListener('click', e => {
    app.selectedDay.classList.remove('future__oneday--selected');
    day.classList.add('future__oneday--selected');
    app.selectedDay = day;

    return app.setDay(day.getAttribute('data-day-id'));
  });
});

app.toggleDialog = function() {
  app.dialog.classList.toggle('dialog--open');
};

app.getForecast = function(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast/daily?appid=${process.env.API_KEY}&units=metric&q=${city}`;
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
  const { card, nextDays } = app;

  card.querySelector('.card__location').textContent = data.city.name;

  let today = new Date();
  today = today.getDay();

  nextDays.forEach(function(nextDay, i) {
    const day = app.daysOfWeek[(i + today) % 7];
    const future = data.list[i];

    nextDay.setAttribute('data-day-id', i);
    nextDay.querySelector('.future__date').textContent = day;
    nextDay.querySelector('.future__icon').style.backgroundImage =
      `url("images/${future.weather[0].icon}.svg")`;
    nextDay.querySelector('.temp--high .temp__value').textContent =
      Math.round(future.temp.max);
    nextDay.querySelector('.temp--low .temp__value').textContent =
      Math.round(future.temp.min);
  });

  app.selectedDay.classList.remove('future__oneday--selected');
  app.nextDays[0].classList.add('future__oneday--selected');
  app.selectedDay = app.nextDays[0];
  app.setDay(0);

  app.spinner.setAttribute('hidden', true);
};

app.setDay = function(dayId) {
  const current = app.data.list[dayId];
  const { card } = app;

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
  app.toggleDialog();
} else {
  app.getForecast(app.city);
}
