import React from 'react';
import '../local-deployment.css';

const LocalDeployment: React.FC = () => {
  return (
    <div className="docs-container">
      <header className="docs-header">
        <h1 className="docs-title">Local Deployment Guide</h1>
        <p className="docs-subtitle">
          A detailed guide to set up Xstro WA Bot locally on Windows, macOS, or Ubuntu.
        </p>
      </header>

      <main className="docs-main">
        {/* Prerequisites */}
        <section className="docs-section">
          <h2 className="docs-section-title">Prerequisites</h2>
          <p className="docs-text">
            Before starting, ensure you have the following tools installed on your system:
          </p>
          <ul className="docs-list">
            <li>
              <strong>Git</strong>: Required for cloning the repository.{' '}
              <a href="https://git-scm.com/downloads">Download Git</a>
            </li>
            <li>
              <strong>Node.js 23</strong>: JavaScript runtime (latest v23.x).{' '}
              <a href="https://nodejs.org/dist/latest-v23.x/">Download Node.js 23</a>
            </li>
            <li>
              <strong>Yarn</strong>: Package manager (v1.x).{' '}
              <a href="https://classic.yarnpkg.com/en/docs/install">Download Yarn</a>
            </li>
            <li>
              <strong>FFmpeg</strong>: Multimedia framework for audio/video processing.{' '}
              <a href="https://ffmpeg.org/download.html">Download FFmpeg</a>
            </li>
          </ul>
        </section>

        {/* Installation Steps */}
        <section className="docs-section">
          <h2 className="docs-section-title">Installation Steps</h2>

          <div className="docs-step">
            <h3>1. Clone the Repository</h3>
            <p className="docs-text">
              Clone the Xstro WA Bot repository from GitHub to your local machine using Git.
            </p>
            <pre className="docs-code">
              <code>git clone https://github.com/AstroX11/Xstro.git</code>
            </pre>
            <p className="docs-note">
              <strong>Note</strong>: Verify Git is installed by running <code>git --version</code>.
              You should see a version number (e.g., <code>git version 2.43.0</code>). If not,
              install Git from the link above.
            </p>
          </div>

          <div className="docs-step">
            <h3>2. Navigate to the Project Directory</h3>
            <p className="docs-text">Move into the cloned repository folder:</p>
            <pre className="docs-code">
              <code>cd Xstro</code>
            </pre>
          </div>

          <div className="docs-step">
            <h3>3. Install Dependencies with Yarn</h3>
            <p className="docs-text">
              Install the project’s Node.js dependencies using Yarn:
            </p>
            <pre className="docs-code">
              <code>yarn install</code>
            </pre>
            <p className="docs-note">
              <strong>Note</strong>: Ensure Yarn is installed (<code>yarn --version</code> should
              return something like <code>1.22.22</code>). If not, install it globally with{' '}
              <code>npm install -g yarn</code> first (one-time use of npm). Run{' '}
              <code>node -v</code> to confirm Node.js 23 is active (e.g., <code>v23.0.0</code>).
            </p>
          </div>

          <div className="docs-step">
            <h3>4. Install FFmpeg</h3>
            <p className="docs-text">
              FFmpeg is essential for media processing. Follow the detailed instructions for your
              operating system:
            </p>

            <h4>Windows</h4>
            <p className="docs-text">
              Windows requires manual downloading and PATH configuration. Here’s a deep dive:
            </p>
            <ol className="docs-sublist">
              <li>
                <strong>Download FFmpeg</strong>: Visit{' '}
                <a href="https://www.gyan.dev/ffmpeg/builds/">gyan.dev</a> (a trusted source) and
                download the latest <code>ffmpeg-git-full.7z</code> file (e.g., under "release
                Builds"). Avoid the "essentials" version for full compatibility.
              </li>
              <li>
                <strong>Extract the Archive</strong>: Use a tool like 7-Zip (
                <a href="https://www.7-zip.org/">Download 7-Zip</a>) to extract the .7z file. Right-click
                the file, select "7-Zip, Extract Here," and place it in a permanent location like{' '}
                <code>C:\ffmpeg</code>. You’ll see folders like <code>bin</code>, <code>doc</code>,
                and <code>presets</code>.
              </li>
              <li>
                <strong>Add FFmpeg to PATH</strong>:
                <ul className="docs-sublist-inner">
                  <li>
                    Open the Start menu, type "Environment Variables," and select "Edit the system
                    environment variables."
                  </li>
                  <li>
                    In the System Properties window, click "Environment Variables."
                  </li>
                  <li>
                    Under "System variables," find and select "Path," then click "Edit…"
                  </li>
                  <li>
                    Click "New" and paste <code>C:\ffmpeg\bin</code> (adjust if you extracted
                    elsewhere). Click "OK" on all dialogs to save.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Verify Installation</strong>: Open a new Command Prompt (cmd) or PowerShell
                and run:
                <pre className="docs-code">
                  <code>ffmpeg -version</code>
                </pre>
                You should see output like <code>ffmpeg version N-112345-gabcdef</code>. If you get
                "‘ffmpeg’ is not recognized," recheck your PATH or restart your computer.
              </li>
            </ol>
            <p className="docs-note">
              <strong>Troubleshooting</strong>: If PATH doesn’t work, copy <code>ffmpeg.exe</code>{' '}
              from <code>C:\ffmpeg\bin</code> to your <code>Xstro</code> folder as a fallback,
              though adding to PATH is preferred.
            </p>

            <h4>macOS</h4>
            <p className="docs-text">
              macOS uses Homebrew for a streamlined FFmpeg installation. Here’s the detailed
              process:
            </p>
            <ol className="docs-sublist">
              <li>
                <strong>Install Homebrew</strong>: If you don’t have Homebrew, install it by opening
                Terminal and running:
                <pre className="docs-code">
                  <code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code>
                </pre>
                Follow the prompts (e.g., enter your password). After installation, run{' '}
                <code>brew --version</code> to confirm (e.g., <code>Homebrew 4.2.0</code>).
              </li>
              <li>
                <strong>Install FFmpeg</strong>: In Terminal, run:
                <pre className="docs-code">
                  <code>brew install ffmpeg</code>
                </pre>
                This downloads and installs FFmpeg with all dependencies. It may take a few minutes
                depending on your internet speed.
              </li>
              <li>
                <strong>Verify Installation</strong>: Run:
                <pre className="docs-code">
                  <code>ffmpeg -version</code>
                </pre>
                Expect output like <code>ffmpeg version 6.0</code>. If not found, run{' '}
                <code>brew link ffmpeg</code> or restart Terminal.
              </li>
            </ol>
            <p className="docs-note">
              <strong>Troubleshooting</strong>: If <code>brew</code> fails, update it with{' '}
              <code>brew update</code> and retry. Ensure Xcode Command Line Tools are installed (
              <code>xcode-select --install</code>).
            </p>

            <h4>Ubuntu</h4>
            <p className="docs-text">
              Ubuntu uses APT for FFmpeg installation. Here’s a thorough guide:
            </p>
            <ol className="docs-sublist">
              <li>
                <strong>Update Package List</strong>: Open Terminal and ensure your package index is
                up-to-date:
                <pre className="docs-code">
                  <code>sudo apt update</code>
                </pre>
                Enter your password when prompted.
              </li>
              <li>
                <strong>Install FFmpeg</strong>: Run:
                <pre className="docs-code">
                  <code>sudo apt install ffmpeg</code>
                </pre>
                Confirm with "Y" if prompted. This installs the latest FFmpeg available in Ubuntu’s
                repositories.
              </li>
              <li>
                <strong>Verify Installation</strong>: Check the version:
                <pre className="docs-code">
                  <code>ffmpeg -version</code>
                </pre>
                You should see <code>ffmpeg version 4.4.2</code> (or similar, depending on Ubuntu
                version).
              </li>
            </ol>
            <p className="docs-note">
              <strong>Troubleshooting</strong>: If FFmpeg is outdated, add a PPA like{' '}
              <code>sudo add-apt-repository ppa:jonathonf/ffmpeg-4</code>, then update and install
              again. Run <code>which ffmpeg</code> to locate it (e.g., <code>/usr/bin/ffmpeg</code>
              ).
            </p>
          </div>

          <div className="docs-step">
            <h3>5. Run the Bot</h3>
            <p className="docs-text">Launch the bot locally using Yarn:</p>
            <pre className="docs-code">
              <code>yarn start</code>
            </pre>
            <p className="docs-note">
              <strong>Note</strong>: Ensure you’re in the <code>Xstro</code> directory. If the bot
              requires environment variables (e.g., API keys), create a <code>.env</code> file as
              per the repo’s README. Check the terminal output for errors and follow any additional
              setup instructions in the GitHub repo.
            </p>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="docs-section">
          <h2 className="docs-section-title">Troubleshooting</h2>
          <ul className="docs-list">
            <li>
              <strong>Git not found</strong>: Run <code>git --version</code>. If missing, reinstall
              from <a href="https://git-scm.com/downloads">git-scm.com</a>.
            </li>
            <li>
              <strong>Node.js version mismatch</strong>: Use <code>nvm</code> (Node Version
              Manager): Install with{' '}
              <a href="https://github.com/nvm-sh/nvm#installing-and-updating">
                nvm instructions
              </a>
              , then <code>nvm install 23</code> and <code>nvm use 23</code>.
            </li>
            <li>
              <strong>Yarn not recognized</strong>: Install globally with{' '}
              <code>npm install -g yarn</code>, then verify with <code>yarn --version</code>.
            </li>
            <li>
              <strong>FFmpeg not found</strong>: Double-check PATH (Windows) or installation steps.
              Run <code>ffmpeg -version</code> to test.
            </li>
            <li>
              <strong>Yarn install fails</strong>: Delete <code>node_modules</code> and{' '}
              <code>yarn.lock</code>, then run <code>yarn install</code> again. Check for network
              issues or conflicting Node versions.
            </li>
          </ul>
        </section>
      </main>

      <footer className="docs-footer">
        © 2024 AstroX11. All rights reserved.
      </footer>
    </div>
  );
};

export default LocalDeployment;