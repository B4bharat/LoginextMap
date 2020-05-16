import { locations } from '../data/locations';

/**
  - Lay the data in a table, create a template and append the data to it
  - pagination logic

  - search
 */
function createTableRows(locs) {
  let rows = [];

  locs.length -= 8000; // TODO:
  for (let i = 0; i < locs.length; i++) {
    let row = `
      <tr>
        <td>${locs[i].key}</td>
        <td>${locs[i].latitude}</td>
        <td>${locs[i].longitude}</td>
      </tr>
    `;
    
    rows.push(row);
  }

  return rows.join(" ");
}

const Header = () => {
  const tableRows = createTableRows(locations);

  const tableBody = `
    <tbody id="table-body">
      ${tableRows}
    </tbody>
  `;

  const tableTemplate = `
    <table class="table table-dark" id="our-table">
      <thead>
        <tr>
          <th>Postal Code</th>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
      </thead>
      ${tableBody}
    </table>
  `;

	return tableTemplate;
};

export default Header;
