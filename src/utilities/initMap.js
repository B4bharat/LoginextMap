const loadGoogleMapsApi = require('load-google-maps-api');
import { locations } from '../data/locations';

let newlyCreatedMap;

class InitMap {

  static loadGoogleMapsApi() {
    return loadGoogleMapsApi({ key: "AIzaSyDU8tMEexcHLYl-J5i_jVOil6Y14jNPjDk" });
  }

  static createMap(googleMaps, mapElement) {
    newlyCreatedMap = new googleMaps.Map(mapElement, {
      center: { lat: 28.6333, lng: 77.2167 },
      zoom: 14
    });
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    let shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };

    for (let i = 0; i < locations.length; i++) {
      let location = locations[i];

      let marker = new googleMaps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: newlyCreatedMap,
        shape: shape,
        title: location.place_name,
      });
    }

    return newlyCreatedMap;
  }

  static panToLocation(googleMaps, searchTerm) {
    let updatedLocations = locations.filter(location => {
      let searchPlaceName = location.place_name.toLowerCase().indexOf(searchTerm);
      let searchPostalCode = location.key.split('/')[1].indexOf(searchTerm);

      if (searchPlaceName !== -1 || searchPostalCode !== -1) {
        return true;
      }
    });

    if (updatedLocations.length === 1) {
      var latLng = new googleMaps.LatLng(updatedLocations[0].latitude, updatedLocations[0].longitude);
      newlyCreatedMap.panTo(latLng);
    }
  }
}
export { InitMap };