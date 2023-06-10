import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FixtureList from './FixtureList';
import FixtureDetails from './FixtureDetails';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b0bec5',
    },
    secondary: {
      main: '#78909c',
    },
    background: {
      default: '#000000',  // Dark gray background
      paper: '#333333',
    },
    text: {
      primary: '#b0bec5',  // Light gray text
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          border: '1px solid #000000',
          boxShadow: 'inset 0 0 10px #b0bec5',
          
        }
      }
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Router>
        <Routes>
          <Route path="/" element={<FixtureList />} />
          <Route path="/fixture/:id" element={<FixtureDetails />} />
        </Routes>
      </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
