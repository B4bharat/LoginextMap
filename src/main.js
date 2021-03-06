import './scss/app.scss';
import { InitMap } from './utilities/initMap';
import App from './App'
import Table from './components/Table'

const app = async () => {
  document.getElementById('app').appendChild(await App())


  // Table Body container for updating pagination
  let tableBodyContainer = document.querySelector('#table-body');

  function alterTable(paginationKey, searchTerm) {
    while (tableBodyContainer.firstChild) {
      tableBodyContainer.removeChild(tableBodyContainer.firstChild);
    }

    let tableTemplate = Table(paginationKey, searchTerm);

    const template = document.createElement('template');
    template.innerHTML = tableTemplate;
    template.innerHTML = template.content.querySelector('#table-body').innerHTML;

    tableBodyContainer.appendChild(template.content.cloneNode(true));
  }

  document
    .querySelector('.pagination-container')
    .addEventListener('click', function (event) {

      alterTable(event.target.value, undefined);
    });

  document.addEventListener("DOMContentLoaded", function () {
    let mapElement = document.getElementById('map');

    InitMap.loadGoogleMapsApi().then(function (googleMaps) {

      InitMap.createMap(googleMaps, mapElement);

      document
        .querySelector('.searchTerm')
        .addEventListener('keyup', function (e) {
          let term = e.target.value.toLowerCase();

          alterTable(undefined, term);

          InitMap.panToLocation(googleMaps, term);
        });

    });
  });
}
// Load app
app()
