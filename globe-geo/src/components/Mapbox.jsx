import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg";
// "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXFhYTA2bTMyeW44ZG0ybXBkMHkifQ.gUGbDOPUN1v1fTs5SeOR4A";
function Mapbox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(18.0);
  const [lat, setLat] = useState(28.0);
  const [zoom, setZoom] = useState(2);
  const [sidebar, setSidebar] = useState(
    `Longitude: ${lng} | Latitude: ${lat} | Zoom: ${zoom}`
  );

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: "mapbox://styles/mapbox/streets-v12",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
      setSidebar(`Longitude: ${lng} | Latitude: ${lat} | Zoom: ${zoom}`);
    });
  });
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("load", () => {
      // Set the default atmosphere style
      map.current.setFog({
        range: [0.8, 8],
        color: "#212121",
        "horizon-blend": 0.01,
        "high-color": "#245bde",
        "space-color": "#000000",
        "star-intensity": 0.15,
      });
      map.current.addSource("earthquakes_ultra", {
        type: "geojson",
        data: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson",
      });
      map.current.addSource("earthquakes_1", {
        type: "geojson",
        data: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson",
      });
      map.current.addSource("earthquakes_2_5", {
        type: "geojson",
        data: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson",
      });
      map.current.addSource("earthquakes_4_5", {
        type: "geojson",
        data: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson",
      });

      map.current.addLayer({
        id: "earthquakes-layer-1",
        type: "circle",
        // type: "symbol",
        source: "earthquakes_1",
        layout: {
          // "icon-image": "custom-marker",
          // // get the title name from the source's "title" property
          // "text-field": ["get", "mag"],
          // "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          // "text-offset": [0, 1.25],
          // "text-anchor": "top",
        },
        paint: {
          "circle-radius": 3,
          "circle-stroke-width": 1,
          "circle-color": "blue",
          "circle-stroke-color": "white",
        },
      });
      map.current.addLayer({
        id: "earthquakes-layer-2",
        type: "circle",
        // type: "symbol",
        source: "earthquakes_2_5",
        layout: {},
        paint: {
          "circle-radius": 3,
          "circle-stroke-width": 1,
          "circle-color": "green",
          "circle-stroke-color": "white",
        },
      });
      map.current.addLayer({
        id: "earthquakes-layer-4",
        type: "circle",
        // type: "symbol",
        source: "earthquakes_4_5",
        layout: {},
        paint: {
          "circle-radius": 3,
          "circle-stroke-width": 1,
          "circle-color": "#ced100",
          "circle-stroke-color": "white",
        },
      });
      map.current.addLayer({
        id: "earthquakes-layer-ultra",
        type: "circle",
        // type: "symbol",
        source: "earthquakes_ultra",
        layout: {},
        paint: {
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-color": "red",
          "circle-stroke-color": "white",
        },
      });
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on(
      "click",
      [
        "earthquakes-layer-1",
        "earthquakes-layer-2",
        "earthquakes-layer-4",
        "earthquakes-layer-ultra",
      ],
      (e) => {
        new mapboxgl.Popup()
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML(
            `<h1 className="text-lg">Place: ${
              e.features[0].properties.place
            }</h1>
            <p>Magnitude: ${e.features[0].properties.mag}</p>
            <p>Time: ${new Date(
              e.features[0].properties.time
            ).toLocaleString()}</p>
            `
          )
          .addTo(map.current);

        setSidebar(`
        Place: ${e.features[0].properties.place} |
        Magnitude: ${e.features[0].properties.mag} |
        Time: ${new Date(e.features[0].properties.time).toLocaleString()}
        `);
      }
    );

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.current.on(
      "mouseenter",
      [
        "earthquakes-layer-1",
        "earthquakes-layer-2",
        "earthquakes-layer-4",
        "earthquakes-layer-ultra",
      ],
      () => {
        map.current.getCanvas().style.cursor = "pointer";
      }
    );

    // Change it back to a pointer when it leaves.
    map.current.on(
      "mouseleave",
      [
        "earthquakes-layer-1",
        "earthquakes-layer-2",
        "earthquakes-layer-4",
        "earthquakes-layer-ultra",
      ],
      () => {
        map.current.getCanvas().style.cursor = "";
      }
    );
  });

  // const l1Loaded = map.current.isSourceLoaded("earthquakes_1");
  // map.current.on("idle", function () {
  //   setSidebar(`Loaded...`);
  // });

  return (
    <div>
      <div className="sidebar">
        {/* Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} */}
        {sidebar}
      </div>
      <div className="sidebar-down mb-10 ml-4">
        <p>Labels:</p>
        <p>🔴 - Significant Earthquakes</p>
        <p>🟡 - Magnitude 4.5+ Earthquakes</p>
        <p>🟢 - Magnitude 2.5+ Earthquakes</p>
        <p>🔵 - Magnitude 1.0+ Earthquakes</p>
        <p className="text-lg font-bold text-green-400">
          Support by{" "}
          <a className="text-lg" href="https://www.buymeacoffee.com/flemking">
            Buying me Coffee ☕️
          </a>
        </p>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Mapbox;
