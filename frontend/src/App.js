import React, { useState } from "react";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import { Container } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',             // Enables dark mode
    primary: {
      main: '#ff1744',        // Dark red as the primary color
    },
    background: {
      default: '#212121',     // Black background
      paper: '#212121',       // Slightly lighter black for paper surfaces
    },
    text: {
      primary: '#f0f0f0',     // Light text for readability
    },
  },
});

function App() {
  const [page, setPage] = useState("LoginPage");
  const [user, setUser] = useState("");

  const handleUser = (username) => {
    setUser(username);
  };

  const handleLogin = async (username) => {
    setUser(username);
    setPage("LandingPage");
  };

  return (
    <ThemeProvider theme = {theme}>
      <CssBaseline />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
        {page === "LoginPage" && (
          <LoginPage setUser={handleUser} onLogin={handleLogin} />
        )}
        {page === "LandingPage" && <LandingPage user={user} />}
      </Container>
    </ThemeProvider>
    
  );
}

export default App;