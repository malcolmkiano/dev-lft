import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import AuthApiService from '../../services/auth-api-service';
import UserContext from '../../contexts/UserContext';
import './UserProfile.css';

export default class UserProfile extends Component {
  state = {
    user: {},
    error: null
  };

  static contextType = UserContext;

  componentDidMount() {
    this.setState({ loading: true });
    let username = this.props.match.params.username;
    this.context.startLoading();
    AuthApiService.getUserInfo(username)
      .then(userInfo => {
        this.setState({ user: { ...userInfo } });
        this.context.stopLoading();
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again'
        });
        this.context.stopLoading();
      });
  }

  getDate = date => {
    const activeDate = new Date(date);
    return format(activeDate, 'MMM yyy');
  };

  render() {
    const {
      user: {
        skills = [],
        bio,
        username,
        first_name,
        last_name,
        date_created,
        github_url,
        linkedin_url,
        twitter_url
      },
      error
    } = this.state;

    const loggedInUsername = this.context.user.username;

    const title = first_name ? `${first_name} ${last_name}` : 'User Profile';
    return (
      <section className="page profile">
        <Helmet>
          <title>{first_name ? `${title}'s Profile` : title} - Dev LFT</title>
        </Helmet>

        <header>
          <div className="wrapper">
            <h2>{title}</h2>
            <span className="highlight">@{username}</span>
          </div>
        </header>

        <div className="page-content">
          <div className="wrapper">
            {error ? (
              <div role="alert" className="info card error">
                <p>{error}</p>
              </div>
            ) : (
              ''
            )}

            {loggedInUsername === username ? (
              <div className="card info">
                <p>This is what your profile looks to others.</p>
                <Link to="/account">
                  <Button isLink={true} className="clear">
                    Edit profile
                  </Button>
                </Link>
              </div>
            ) : (
              ''
            )}

            <div className="grid">
              <div className="column column-1-2">
                <article className="card bio">
                  <h3 className="title">Bio</h3>
                  <p className="project">{bio || 'An awesome DevLFT user.'}</p>
                  <p>
                    Active since{' '}
                    {date_created
                      ? this.getDate(date_created)
                      : 'you loaded this page'}
                  </p>
                </article>

                <article className="card">
                  <h3 className="title">Links</h3>
                  <ul className="project links">
                    {!github_url && !twitter_url && !linkedin_url && (
                      <li>No links, yet!</li>
                    )}
                    {github_url && (
                      <li>
                        <a
                          rel="noopener noreferrer"
                          target="_blank"
                          href={github_url}
                        >
                          Github
                        </a>
                      </li>
                    )}
                    {twitter_url && (
                      <li>
                        <a
                          rel="noopener noreferrer"
                          target="_blank"
                          href={twitter_url}
                        >
                          Twitter
                        </a>
                      </li>
                    )}
                    {linkedin_url && (
                      <li>
                        <a
                          rel="noopener noreferrer"
                          target="_blank"
                          href={linkedin_url}
                        >
                          LinkedIn
                        </a>
                      </li>
                    )}
                  </ul>
                </article>
              </div>

              <div className="column column-1-2 skills">
                <article className="card">
                  <h3 className="title">Skills</h3>
                  <ul>
                    {skills.length ? (
                      skills.map((skill, i) => (
                        <li key={i} className="project">
                          {skill}
                        </li>
                      ))
                    ) : (
                      <li className="project">Experienced #LFTer</li>
                    )}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

UserProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  })
};
