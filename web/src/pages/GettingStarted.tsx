import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const GettingStarted: React.FC = () => {
  return (
    <div className="container">
      <div className="hero">
        <h1 className="title">Getting Started with Xstro WA Bot</h1>
        <p className="description">Deploy Xstro WA Bot on your preferred platform.</p>
        <div className="button-group deployment-buttons">
            {/* Session */}
<a href="https://session.koyeb.app/" className="button deploy-button">
  <svg
    className="deploy-icon"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
  </svg>
  Get Session
</a>
          {/* Heroku */}
          <a href="https://www.heroku.com/deploy?template=https://github.com/AstroX11/Xstro" className="button deploy-button">
            <svg className="deploy-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4l4 4v-6l-4 4V7l6 5-6 5z" />
            </svg>
            Heroku Deploy
          </a>
          {/* Koyeb */}
          <a href="https://app.koyeb.com/deploy?name=xstro&repository=AstroX11%2FXstro&branch=master&builder=dockerfile&instance_type=free&instances_min=0&env%5BMETA_DATA%5D=&env%5BSESSION%5D=&env%5BSESSION_URL%5D=&env%5BTIME_ZONE%5D=&env%5BWARN_COUNT%5D=3" className="button deploy-button">
            <svg className="deploy-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-14v8l5-4-5-4z" />
            </svg>
            Koyeb Deploy
          </a>
          {/* Render */}
          <a href="https://render.com/deploy?repo=https://github.com/AstroX11/Xstro" className="button deploy-button">
            <svg className="deploy-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM9 7h6v10H9V7zm2 2v6h2V9h-2z" />
            </svg>
            Render Deploy
          </a>
          {/* Panel (Pterodactyl assumed) */}
          <a href="https://pterodactyl.io/" className="button deploy-button">
            <svg className="deploy-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L1 9v6l11 7 11-7V9L12 2zm0 2.83L19.17 9 12 13.17 4.83 9 12 4.83zM3 10.83L10.17 15 3 19.17V10.83zm18 0V19.17L13.83 15 21 10.83z" />
            </svg>
            Panel Deploy
          </a>
          {/* Codespaces */}
          <a href="https://github.com/codespaces/new?skip_quickstart=true&machine=standardLinux32gb&repo=882210451&ref=master&geo=EuropeWest" className="button deploy-button">
            <svg className="deploy-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4h2v4h-2zm0-6V7h2v4h-2z" />
            </svg>
            Codespaces Deploy
          </a>
          {/* Replit */}
          <a href="https://replit.com/github/AstroX11/Xstro" className="button deploy-button">
            <svg className="deploy-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v10H7V7zm2 2v6h6V9H9z" />
            </svg>
            Replit Deploy
          </a>
          {/* Local Deployment */}
          <Link to="/local-deployment" className="button deploy-button">
            <svg className="deploy-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v6h-2V6zm0 8h2v2h-2v-2z" />
            </svg>
            Local Deployment
          </Link>
        </div>
      </div>
      <footer className="footer">
        © 2024 AstroX11. All rights reserved.
      </footer>
    </div>
  );
};

export default GettingStarted;