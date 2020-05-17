import './scss/app.scss';
import App from './App'
import Table, { TableBody } from './components/Table'

const app = async () => {
  document.getElementById('app').appendChild(await App())

  
  // Table Body container for updating pagination
  let tableBodyContainer = document.querySelector('#table-body');

  function alterTable(params) {
    
  }

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
      
      tableBodyContainer.appendChild(template.content.cloneNode(true));
    });
  
  document
    .querySelector('.searchTerm')
    .addEventListener('keyup', function(e) {
      const term = e.target.value.toLowerCase();
      console.log('term', term);
      
      let tableTemplate = Table(undefined, term);

      while(tableBodyContainer.firstChild) {
        tableBodyContainer.removeChild(tableBodyContainer.firstChild);
      }
      
      const template = document.createElement('template');
      template.innerHTML = tableTemplate;
      console.log('template', template);
      
      template.innerHTML = template.content.querySelector('#table-body').innerHTML;
      
      tableBodyContainer.appendChild(template.content.cloneNode(true));
    })
}
// Load app
app()
