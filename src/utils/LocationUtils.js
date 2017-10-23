export default {
  getLocation: async function (locationString, requestObject) {
    let response = await requestObject.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(locationString) + '&key=AIzaSyBE-PlO7hiB520Y0VN4_0JkMHk69v0n17w')
    return response.body.results[0].geometry.location
  }
}
