const MapboxClient = require("mapbox");
const client = new MapboxClient(process.env.MAPBOX_KEY);
async function getCooridinatesForAddress(address = "") {
  let result = {
    lat: 40.74,
    lang: -73.98,
  };

  try {
    const res = await client.geocodeForward(address);
    const data = res.entity; // data is the geocoding result as parsed JSON
    if (data.features[0].center)
      result = {
        lat: data.features[0].center[1],
        lang: data.features[0].center[0],
      };
  } catch (error) {
    throw new Error("Creation failed!");
  } finally {
    return result;
  }
}

module.exports = {
  getCooridinatesForAddress,
};
