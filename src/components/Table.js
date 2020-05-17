import { locations } from '../data/locations';

let state = {
  querySet: locations,
  currentPage: 1,
  defaultRows: 20
};

/**
  X- Lay the data in a table, create a template and append the data to it
  - pagination logic
  - search
  - map
 */
function pagination(locs) {
  let trimStart = (state.currentPage - 1) * state.defaultRows;
  let trimEnd = trimStart + state.defaultRows;

  let trimmedData = locs.slice(trimStart, trimEnd);

  let pages = Math.ceil(locs.length/state.defaultRows);

  return {
    trimmedData,
    pages
  }
}

function createPageButtons(pages) {
  let buttonTemplate = ``;

  for (let page = 1; page <= pages; page++) {
    buttonTemplate += `
      <button value=${page} type="button" class="btn btn-info">${page}</button>
    `;
  }

  return buttonTemplate;
}

function createTableRows(locs) {
  if (locs.length >= 8000) {
    locs.length -= 8000; // TODO: 
  }

  let paginatedData = pagination(locs);
  console.log('paginatedData', paginatedData);

  let rows = [];
  for (let i = 0; i < paginatedData.trimmedData.length; i++) {
    let row = `
      <tr>
        <td>${paginatedData.trimmedData[i].place_name}</td>
        <td>${paginatedData.trimmedData[i].key.split('/')[1]}</td>
        <td>${paginatedData.trimmedData[i].latitude}</td>
        <td>${paginatedData.trimmedData[i].longitude}</td>
      </tr>
    `;
    
    rows.push(row);
  }

  return rows.join(" ");
}

const TableBody = (rows) => {

  const tableBody = `
    <tbody id="table-body">
      ${rows}
    </tbody>
  `;

  return tableBody;
}

const Table = (clickTarget) => {
  // setting currentPage
  state.currentPage = clickTarget !== undefined ? clickTarget : 1;
  
  // Table Rows
  const tableRows = createTableRows(state.querySet);

  // Table Body
  const tableBody = TableBody(tableRows);

  // Pagination
  let paginatedData = pagination(state.querySet);
  const pageButtons = createPageButtons(paginatedData.pages);

  // Table Template
  const tableTemplate = `
    <table class="table table-dark" id="our-table">
      <thead>
        <tr>
          <th>Place</th>
          <th>Postal Code</th>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
      </thead>
      ${tableBody}
    </table>
    <div class="pagination-container">
      ${pageButtons}
    </div>
  `;

	return tableTemplate;
};

export default Table;
