import { locations } from '../data/locations';

let currentPage = 1;
let defaultRows = 20;

/**
  X- Lay the data in a table, create a template and append the data to it
  - pagination logic
  - search
 */
function pagination(locs) {
  let trimStart = (currentPage - 1) * defaultRows;
  let trimEnd = trimStart + defaultRows;

  let trimmedData = locs.slice(trimStart, trimEnd);

  let pages = Math.ceil(locs.length/defaultRows);

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
  locs.length -= 8000; // TODO:

  let paginatedData = pagination(locs)
  console.log(paginatedData);

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

const Table = () => {
  // Table Rows
  const tableRows = createTableRows(locations);

  // Table Body
  const tableBody = TableBody(tableRows);

  let paginatedData = pagination(locations);
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
