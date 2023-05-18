import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FixtureList from './FixtureList';
import FixtureDetails from './FixtureDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FixtureList />} />
        <Route path="/fixture/:id" element={<FixtureDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
