import React from "react";
import { Container, Card, CardContent, Typography, Box } from "@mui/material";


const LandingPage = ({ user }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome, {user}!
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" align="center">
              This is your landing page. Enjoy exploring your dashboard and managing your content.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LandingPage;