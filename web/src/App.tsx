import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GettingStarted from './pages/GettingStarted';
import LocalDeployment from './pages/LocalDeployment';
import Session from './pages/Session';
import './styles.css';

const App: React.FC = () => {
 return (
  <Routes>
   <Route path="/" element={<Home />} />
   <Route path="/getting-started" element={<GettingStarted />} />
   <Route path="/local-deployment" element={<LocalDeployment />} />
   <Route path="/session" element={<Session />} />
  </Routes>
 );
};

export default App;
