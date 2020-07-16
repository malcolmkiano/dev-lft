import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import Button from '../Button/';
import Notifications from '../Notifications';
import Avatar from '../Avatar';
import './Nav.css';

// images
import { Logo, MenuIcon } from '../../images';

export default class Nav extends Component {
  static contextType = UserContext;
  static defaultProps = {
    location: {
      pathname: '/'
    }
  };

  state = {
    fixed: false,
    menuOpen: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    let isFixed = false;
    if (window.scrollY > 0) {
      isFixed = true;
    }

    if (this.state.fixed !== isFixed) this.setState({ fixed: isFixed });
  };

  toggleMenu = (newState = !this.state.menuOpen) => {
    if (newState === this.state.menuOpen) return;

    this.setState({
      menuOpen: newState
    });
  };

  handleLogOut = () => {
    const { onLogOut = () => null } = this.context;
    onLogOut();
  };

  renderLinks(links) {
    const currentPath = this.props.location.pathname;
    return links.map(
      ({ text, path = '/', className = '', onClick = () => null }) => (
        <li key={path}>
          <Link
            to={path}
            className={`${className} ${
              path !== '/' && currentPath.includes(path) ? 'active' : ''
            }`}
            onClick={() => {
              this.toggleMenu(false);
              onClick();
            }}
          >
            {text}
          </Link>
        </li>
      )
    );
  }

  renderPublicLinks() {
    const kindaPublicLinks = [{ text: 'Feed', path: '/feed' }];

    const publicLinks = [
      { text: 'Sign Up', path: '/signup' },
      { text: 'Login', path: '/login' }
    ];

    const { menuOpen } = this.state;

    return (
      <div
        aria-hidden={!menuOpen}
        role={menuOpen ? 'alert' : ''}
        className={`link-container ${menuOpen ? 'active' : ''}`}
      >
        <ul className="links links-left">
          {this.renderLinks(kindaPublicLinks)}
        </ul>
        <ul className="links links-right">{this.renderLinks(publicLinks)}</ul>
      </div>
    );
  }

  renderPrivateLinks(user) {
    const privateLinks = [
      { text: 'Feed', path: '/feed' },
      { text: 'Projects', path: '/projects' },
      { text: 'Chats', path: '/chats' },
      { text: 'Account', path: '/account', className: 'mobile' },
      { text: 'Log Out', onClick: this.handleLogOut, className: 'mobile' }
    ];

    const { menuOpen } = this.state;

    return (
      <div
        aria-hidden={!menuOpen}
        role={menuOpen ? 'alert' : ''}
        className={`link-container ${menuOpen ? 'active' : ''}`}
      >
        <ul className="links links-left">{this.renderLinks(privateLinks)}</ul>
      </div>
    );
  }

  render() {
    const {
      user,
      user: { isAuth }
    } = this.context;
    const { fixed, menuOpen } = this.state;
    const { pathname } = this.props.location;

    // the nav bar is absolutely positioned
    // this variable being `true` will render
    // a div to push the rest of the content down
    // if user is on any private page (as per design)
    const noPushPages = ['/', '/login', '/signup'];
    const push = !noPushPages.includes(pathname);

    return (
      <React.Fragment>
        <nav className={`${fixed ? 'fixed' : ''} ${push ? 'bg' : ''}`}>
          <div className="wrapper">
            <Link to="/" className="home-link">
              <Logo className="logo" />
              <span className="hidden">Home</span>
            </Link>
            <div
              role="button"
              className={`link-container-shadow ${menuOpen ? 'active' : ''}`}
              onClick={() => this.toggleMenu(false)}
            >
              <span className="hidden">Close menu</span>
            </div>
            {isAuth ? (
              <React.Fragment>
                {this.renderPrivateLinks(user)}
                <ul className="links links-right">
                  <li className="pull-right">
                    <Notifications />
                  </li>
                  <li className="desktop">
                    <Link
                      to="/account"
                      title="Your Account"
                      onClick={() => this.toggleMenu(false)}
                    >
                      <Avatar
                        first_name={user.first_name}
                        last_name={user.last_name}
                      />
                    </Link>
                  </li>
                </ul>
              </React.Fragment>
            ) : (
              this.renderPublicLinks()
            )}
            <Button className="clear menu-btn" onClick={this.toggleMenu}>
              <MenuIcon className="menu" />
              <span className="hidden">Menu</span>
            </Button>
          </div>
        </nav>
        {push ? <div className="nav-push"></div> : ''}
      </React.Fragment>
    );
  }
}
