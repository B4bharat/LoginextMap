import './scss/app.scss';
import App from './App'
import Table, { TableBody } from './components/Table'
/**
  X- Get Table Body
  - check why the new elements aren't coming
 */

const app = async () => {
  document.getElementById('app').appendChild(await App())

  
  let tableBodyContainer = document.querySelector('#table-body');

  document
    .querySelector('.pagination-container')
    .addEventListener('click', function (event) {

      while(tableBodyContainer.firstChild) {
        tableBodyContainer.removeChild(tableBodyContainer.firstChild);
      }

      let tableTemplate = Table(event.target.value);
      
      const template = document.createElement('template');
      template.innerHTML = tableTemplate;
      template.innerHTML = template.content.querySelector('#table-body').innerHTML;
      console.log('template', template);
      

      tableBodyContainer.appendChild(template.content.cloneNode(true));
    });
}
// Load app
app()
