import React, { useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import Globe from "react-globe.gl";
import * as THREE from "three";
import WorldFlightsGlobe from "./WorldFlightsGlobe";

const LoginPage = ({ onLogin, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const submitCredentials = async (event) => {
    event.preventDefault();

    const endpoint = isSignUp ? "sign_up" : "sign_in";
    const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/+$/, "");

    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Response from Flask:", data.message);

      if (data.status === "success") {
        if (isSignUp) {
          alert("Sign-up successful! You can now log in.");
          setIsSignUp(false);
        } else {
          setUser(username);
          onLogin(username);
        }
      } else {
        alert(data.message);
      }
      
    } catch (error) {
      console.error("Error submitting credentials:", error);
      alert("There was an error. Please try again.");
    }
  };

  return (
    <>
    {/* Globe container: full screen background */}
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '80%',
        height: '100%',
        overflow: 'visible',
        zIndex: -1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          transform: "scale(0.9)",         // Scales the globe down to 50%
          transformOrigin: "center center", // Ensure it scales from the center
          width: "100%",
          height: "100%",
        }}
      >
      <WorldFlightsGlobe />
      </Box>
    </Box>
    
    {/* Sign-in box: centered card with semi-transparent background */}
    <Container
      maxWidth="sm"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
        mt: 4, // optional margin to create some space from the very edge
        ml: 2,
      }}
      >
        <Card sx={{ background: 'transparent', boxShadow: 'none'}}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              {isSignUp ? "Sign Up" : "Login"}
            </Typography>
            <Box component="form" onSubmit={submitCredentials} sx={{ mt: 2}}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setIsSignUp((prev) => !prev)}
                  >
                    {isSignUp ? "Already have an account?" : "New Here?"}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" type="submit" fullWidth>
                    Continue
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
  </>
  );
};

export default LoginPage;