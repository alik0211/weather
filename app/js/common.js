let userCity = localStorage.getItem('city');

if (userCity === null) {
  toggleDialog(true);

  document.querySelector('.mdc-dialog__footer__button').addEventListener('click', function() {
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
    document.querySelector('.mdc-dialog').classList.add('mdc-dialog--open');
  } else {
    document.querySelector('.mdc-dialog').classList.remove('mdc-dialog--open');
  }
}

function getWeather(city) {
  return fetch('https://alik0211.tk/weather0211/data.php?city=' + userCity).then(response => {
    return response.json();
  });
}

function updateWeather(data) {
  const card = document.querySelector('.card');

  card.querySelector('.location').textContent = userCity;
  card.querySelector('.description').textContent = data.weather[0].description;

  card.querySelector('.current .temperature .value').textContent = Math.round(data.main.temp);
  card.querySelector('.current .icon').style.backgroundImage = `url("images/${data.weather[0].icon}.svg")`;
  card.querySelector('.current .wind .value').textContent = Math.round(data.wind.speed);
  card.querySelector('.current .clouds .value').textContent = data.clouds.all;

  // document.querySelector('.loader').setAttribute('hidden', true);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(function() {
      console.log('Service Worker Registered');
    });
}
