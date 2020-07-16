import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// images
import { Logo, FacebookIcon, TwitterIcon, LinkedInIcon } from '../../images';

export default class Footer extends Component {
  static defaultProps = {
    location: {
      pathname: '/'
    }
  };

  render() {
    // hide the footer on the login and signup pages
    const currentPath = this.props.location.pathname;
    const isLoginOrSignup =
      currentPath === '/signup' || currentPath === '/login';

    return !isLoginOrSignup ? (
      <footer>
        <div className="wrapper">
          <div className="footer-left">
            <Link to="/" className="logo">
              <Logo />
              <span className="hidden">Home</span>
            </Link>
            <p>All rights reserved.</p>
          </div>

          <div className="footer-right">
            <ul className="links">
              <li>
                <a
                  href="https://facebook.com/DevLFT"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <FacebookIcon />
                  <span className="hidden">Like DevLFT on Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/DevLFT"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <TwitterIcon />
                  <span className="hidden">Follow DevLFT on Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/DevLFT"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <LinkedInIcon />
                  <span className="hidden">Follow DevLFT on LinkedIn</span>
                </a>
              </li>
            </ul>
            <p className="version">App version 1.0.0</p>
          </div>
        </div>
      </footer>
    ) : (
      ''
    );
  }
}
