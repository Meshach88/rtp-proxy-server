const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.post('/proxy-osrm', (req, res) => {
  const { waypoints } = req.body;

  if (!waypoints || waypoints.length < 2) {
    return res.status(400).json({ error: 'At least two waypoints are required.' });
  }

  // Construct the OSRM query URL with all waypoints
  const coordinates = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

  // Forward the request to the OSRM API
  axios.get(osrmUrl)
    .then(response => {
      res.json(response.data);  // Send back the OSRM response to the frontend
    })
    .catch(error => {
      console.error('Error contacting OSRM API:', error);
      res.status(500).json({ error: 'Error contacting OSRM API' });
    });
});

// Start the proxy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
