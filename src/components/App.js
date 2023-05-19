import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FixtureList from './FixtureList';
import FixtureDetails from './FixtureDetails';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    text: {
      primary: '#b3b3b3',
      secondary: '#b3b3b3',
    },
    background: {
      default: '#000000',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<FixtureList />} />
          <Route path="/fixture/:id" element={<FixtureDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
