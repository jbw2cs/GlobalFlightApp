import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function UpcomingFlights({ airport = 'AUS' }) {
  const [flights, setFlights] = useState([]);

  const fetchFlights = async () => {
    try {
      const res = await fetch(`/api/upcoming?airport=${airport}`);
      if (!res.ok) throw new Error('Network error');
      setFlights(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFlights();
    const iv = setInterval(fetchFlights, 60_000);
    return () => clearInterval(iv);
  }, [airport]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        width: 280,
        zIndex: 1200,
      }}
    >
      <Card elevation={4}>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="subtitle1" gutterBottom align="center">
            Departing Soon
          </Typography>

          {flights.length > 0 ? (
            flights.map((f) => (
              <Box key={f.flight_iata} sx={{ mb: 1 }}>
                <Typography variant="body2" component="span" fontWeight="bold">
                  {f.flight_iata}
                </Typography>{' '}
                → {f.arr_iata}  
                <br />
                <Typography variant="caption" color="text.secondary">
                  {new Date(f.dep_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {'  '}
                  ({f.status})
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" align="center" color="text.secondary">
              No flights in next 30 min.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}