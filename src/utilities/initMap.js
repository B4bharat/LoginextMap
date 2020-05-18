const loadGoogleMapsApi = require('load-google-maps-api');
import { locations } from '../data/locations';

class InitMap {

  static loadGoogleMapsApi() {
    return loadGoogleMapsApi({ key: "AIzaSyDU8tMEexcHLYl-J5i_jVOil6Y14jNPjDk" });
  }

  static createMap(googleMaps, mapElement) {
    let map = new googleMaps.Map(mapElement, {
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
        map: map,
        shape: shape,
        title: location.place_name,
      });
    }

    return map;
  }
}
export { InitMap };