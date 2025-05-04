import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Home: React.FC = () => {
  return (
    <div className="container">
      <div className="hero">
        <h1 className="title">Xstro WA Bot</h1>
        <p className="description">Free, easy-to-use, open-source WhatsApp bot designed for seamless automation and customization!</p>
        <div className="button-group">
          <Link to="/getting-started" className="button">
            Get Started
          </Link>
          <a href="https://github.com/AstroX11/Xstro" className="button github-button">
            <svg
              className="github-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.799 8.205 11.387.6.111.82-.261.82-.577 0-.285-.011-1.04-.017-2.04-3.338.724-4.042-1.609-4.042-1.609-.546-1.385-1.332-1.754-1.332-1.754-1.087-.743.083-.729.083-.729 1.205.135 1.838 1.236 1.838 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.304.762-1.604-2.665-.304-5.466-1.332-5.466-5.931 0-1.31.465-2.38 1.236-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.398 3-.403 1.02.005 2.043.137 3 .403 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.771.84 1.236 1.91 1.236 3.22 0 4.61-2.803 5.625-5.475 5.921.429.369.823 1.096.823 2.21 0 1.596-.015 2.88-.017 3.27 0 .318.217.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"
                fill="currentColor"
              />
            </svg>
            GitHub
          </a>
        </div>
      </div>
      <footer className="footer">
        © 2024 AstroX11. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;