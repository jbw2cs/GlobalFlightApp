// src/WorldGlobe.js
import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import { csvParseRows } from "d3-dsv";
import indexBy from "index-array-by";

const COUNTRY = "United States";
const OPACITY = 0.80;

const WorldFlightsGlobe = () => {
  const globeEl = useRef();
  const [airports, setAirports] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat")
        .then((res) => res.text())
        .then((d) =>
          csvParseRows(d, ([airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source]) => ({
            airportId,
            name,
            city,
            country,
            iata,
            icao,
            lat,
            lng,
            alt,
            timezone,
            dst,
            tz,
            type,
            source,
          }))
        ),
      fetch("https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat")
        .then((res) => res.text())
        .then((d) =>
          csvParseRows(d, ([airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment]) => ({
            airline,
            airlineId,
            srcIata,
            srcAirportId,
            dstIata,
            dstAirportId,
            codeshare,
            stops,
            equipment,
          }))
        ),
    ]).then(([airportsData, routesData]) => {
      const byIata = indexBy(airportsData, "iata", false);

      const filteredRoutes = routesData
        .filter((d) => byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata))
        .filter((d) => d.stops === "0")
        .map((d) =>
          Object.assign(d, {
            srcAirport: byIata[d.srcIata],
            dstAirport: byIata[d.dstIata],
          })
        )
        .filter((d) => d.srcAirport.country === COUNTRY && d.dstAirport.country !== COUNTRY);

      setAirports(airportsData);
      setRoutes(filteredRoutes);
    });
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 39.6, lng: -98.5, altitude: 2 });
    }
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
      arcsData={routes}
      arcLabel={(d) => `${d.airline}: ${d.srcIata} → ${d.dstIata}`}
      arcStartLat={(d) => +d.srcAirport.lat}
      arcStartLng={(d) => +d.srcAirport.lng}
      arcEndLat={(d) => +d.dstAirport.lat}
      arcEndLng={(d) => +d.dstAirport.lng}
      arcDashLength={0.25}
      arcDashGap={1}
      arcDashInitialGap={() => Math.random()}
      arcDashAnimateTime={4000}
      arcColor={(d) => [`rgba(0, 255, 0, ${OPACITY})`, `rgba(255, 0, 0, ${OPACITY})`]}
      arcsTransitionDuration={0}
      pointsData={airports}
      pointColor={() => "orange"}
      pointAltitude={0}
      pointRadius={0.02}
      pointsMerge={true}
      autoRotate
      autoRotateSpeed={0.5}
      backgroundColor="rgba(0,0,0,0)"
    //   style={{ width: "100%", height: "100%" }}
    />
  );
};

export default WorldFlightsGlobe;