let userCity = localStorage.getItem('city');

if (userCity === null) {
  toggleDialog(true);

  document.querySelector('.button').addEventListener('click', function() {
    userCity = document.getElementById('city').value;
    toggleDialog(false);
    getWeather(userCity).then(data => updateWeather(data));
    localStorage.setItem('city', userCity);
  });
} else {
  getWeather(userCity).then(data => updateWeather(data));
}

if ('caches' in window) {
  caches.match('https://alik0211.tk/weather0211/data.php?city=' + userCity).then(function(response) {
    if (response) {
      response.json().then(function(data) {
        updateWeather(data);
      });
    }
  });
}

function toggleDialog(visible) {
  if (visible) {
    document.querySelector('.dialog').classList.add('dialog--open');
  } else {
    document.querySelector('.dialog').classList.remove('dialog--open');
  }
}

function getWeather(city) {
  return fetch('https://alik0211.tk/weather0211/data.php?city=' + userCity).then(response => {
    return response.json();
  });
}

function updateWeather(data) {
  const card = document.querySelector('.card');

  card.querySelector('.card__location').textContent = userCity;
  card.querySelector('.card__description').textContent = data.weather[0].description;

  card.querySelector('.visual__value').textContent = Math.round(data.main.temp);
  card.querySelector('.visual__icon').style.backgroundImage = `url("images/${data.weather[0].icon}.svg")`;
  card.querySelector('.description__wind .description__value').textContent = Math.round(data.wind.speed);
  card.querySelector('.description__clouds .description__value').textContent = data.clouds.all;

  // document.querySelector('.loader').setAttribute('hidden', true);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(function() {
      console.log('Service Worker Registered');
    });
}
