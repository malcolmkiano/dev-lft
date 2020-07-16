import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Button from '../../components/Button';
import ApiAuthService from '../../services/auth-api-service';
import TokenService from '../../services/token-service';
import UserContext from '../../contexts/UserContext';
import './Signup.css';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    const passedState =
      props.history.location && props.history.location.state
        ? props.history.location.state
        : { error: null };
    this.state = { ...passedState };
  }

  static defaultProps = {
    history: {
      goBack: () => null,
      location: {}
    }
  };

  static contextType = UserContext;

  state = { error: null };

  handleSignup = e => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const firstname = e.target.first_name.value;
    const lastname = e.target.last_name.value;

    this.context.startLoading();
    ApiAuthService.postUser({
      username: username,
      password: password,
      first_name: firstname,
      last_name: lastname
    })
      .then(user => {
        TokenService.saveAuthToken(user.authToken);
        this.context.onAuth();
        let lastLocation = this.state.from.pathname;
        if (lastLocation) {
          this.props.history.push(lastLocation);
        } else {
          this.props.history.goBack();
        }
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
        this.context.stopLoading();
      });
  };

  render() {
    const error = this.state.error;
    return (
      <div className="sign-up hero">
        <Helmet>
          <title>Sign Up - Dev LFT</title>
        </Helmet>

        <h1 className="hidden">Sign Up</h1>

        <form className="card" onSubmit={this.handleSignup} autoComplete="off">
          <h2 className="h3 title">Let's get started.</h2>
          <p className="subtitle">Fill in the fields below to sign up.</p>
          {error ? (
            <p role="alert" className="error">
              {error}
            </p>
          ) : (
            ''
          )}
          <div className="input-group">
            <div className="input">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                placeholder="John"
                name="first_name"
                minLength="2"
                maxLength="30"
                required
              />
            </div>
            <div className="input">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                placeholder="Doe"
                name="last_name"
                minLength="2"
                maxLength="30"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="johndoe"
                name="user_name"
                minLength="2"
                maxLength="30"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input">
              <label htmlFor="pwd">Password</label>
              <input
                type="password"
                id="pwd"
                name="password"
                minLength="8"
                maxLength="72"
                required
              />
            </div>
          </div>

          <Button type="submit">Sign Up</Button>

          <p>
            Already a Dev LFT member?{' '}
            <Link
              to={{
                pathname: '/login',
                state: { ...this.state, error: null }
              }}
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    );
  }
}

Signup.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func
  })
};

export default Signup;
