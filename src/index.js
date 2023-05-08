import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const countryName = event.target.value.trim();
  if (countryName === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        const marcup = data
          .map(country => {
            return `<li class="country-list-item">
                <img src="${country.flags.svg}" alt="" width="50px"/>
                <p class="list-item-paragraph">${country.name.official}</p>
            </li>`;
          })
          .join('');
        refs.countryList.insertAdjacentHTML('afterbegin', marcup);
      } else {
        const marcup = data
          .map(country => {
            const languages = Object.values(country.languages);
            return `
                <img src="${country.flags.svg}" alt="" width="50px"/>
                <p class="item-paragraph">${country.name.official}</p>
                <p><b>Capital: </b>${country.capital}</p>
                <p><b>Population: </b>${country.population}</p>
                <p><b>Languages: </b>${languages}</p>
            `;
          })
          .join('');
        refs.countryInfo.insertAdjacentHTML('afterbegin', marcup);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name.');
    });
}
