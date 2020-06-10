import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Button from '../Button/Button';
import AuthApiService from '../../services/auth-api-service';
import UserContext from '../../contexts/UserContext';
import './Account.css';

// images
import { CloseIcon, SaveIcon } from '../../images';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateSuccess: false,
      formDirty: false,
      user: {},
      error: null
    }

    this.accountForm = React.createRef();
  }
  static contextType = UserContext;

  handleUpdate = event => {
    event.preventDefault();

    const {
      first_name,
      last_name,
      github_url,
      linkedin_url,
      twitter_url,
      notifications,
      bio,
      skills
    } = event.target;

    const notificationPrefs = Array.prototype.slice.call(notifications)
      .filter(input => input.checked)
      .map(input => input.value);

    const updatedInfo = {
      first_name: first_name.value,
      last_name: last_name.value,
      github_url: github_url.value,
      linkedin_url: linkedin_url.value,
      twitter_url: twitter_url.value,
      notifications: notificationPrefs,
      bio: bio.value,
      skills: skills.value.split(', ').filter(Boolean)
    };

    AuthApiService.updateUserInfo(updatedInfo)
      .then(() => {
        this.setState({ updateSuccess: true, formDirty: false });
        this.context.onProfileUpdate(updatedInfo);
      })
      .catch(error => error.error);
  };

  dismissSuccessMsg = () => {
    this.setState({ updateSuccess: false, error: null });
  }

  handleFormEntry = () => {
    this.setState({ formDirty: true });
  }

  handleNotificationChange = e => {
    const { value, checked } = e.target;
    let notifications = [...this.context.user.notifications];
    const newNotificationSettings = !checked
      ? notifications.filter(n => n !== value)
      : [...notifications, value];

    this.context.setNotifications(newNotificationSettings);
  }

  renderNotifications = () => {
    const { user: { notifications = [] } } = this.context;
    const notificationTypes = [
      { type: 'chat', description: 'New chat messages' },
      { type: 'join', description: 'People joining your teams' },
      { type: 'leave', description: 'People leaving your teams' },
      { type: 'post', description: 'New posts to your teams\' discussion boards' }
    ]

    return notificationTypes.map(({ type, description }, i) => (
      <label className="check" key={i}>
        <input
          name="notifications"
          checked={notifications.includes(type)}
          onChange={this.handleNotificationChange}
          value={type}
          type="checkbox" />
        <span>{description}</span>
      </label>
    ));
  }

  render() {
    const {
      user: {
        first_name,
        last_name,
        github_url,
        linkedin_url,
        twitter_url,
        username,
        bio,
        skills = []
      }
    } = this.context;

    const { formDirty, error } = this.state;

    return (
      <form className="page account" onSubmit={this.handleUpdate} onInput={this.handleFormEntry} ref={this.accountForm}>
        <Helmet>
          <title>Your Account - Dev LFT</title>
        </Helmet>

        <header>
          <div className="wrapper">
            <h2>Your Account</h2>
            <Button swap={SaveIcon} disabled={!formDirty} type="submit">Save changes</Button>
          </div>
        </header>

        <div className="page-content">
          <div className="wrapper">
            {this.state.updateSuccess || error
              ? (
                <div role="alert" className={`info card ${error ? 'error' : ''}`}>
                  <p>{error ? error : 'Your profile has been updated'}</p>
                  <Button className="clear" onClick={this.dismissSuccessMsg}><CloseIcon /></Button>
                </div>
              )
              : ''}

            <div className="grid">
              <div className="column column-1-2">
                <article className="card" spellCheck={false}>
                  <h3 className="title">Profile</h3>
                  <div className="input-group">
                    <div className="input">
                      <label htmlFor="first_name">First name *</label>
                      <input id="first_name" type="text" name="first_name" required placeholder="John" defaultValue={first_name} />
                    </div>
                    <div className="input">
                      <label htmlFor="last_name">Last name *</label>
                      <input id="last_name" type="text" name="last_name" required placeholder="Doe" defaultValue={last_name} />
                    </div>
                  </div>
                  <div className="input-group">
                    <div className="input">
                      <label htmlFor="github_url">GitHub URL</label>
                      <input id="github_url" type="url" name="github_url" placeholder="https://github.com/johndoe" defaultValue={github_url} />
                    </div>
                  </div>
                  <div className="input-group">
                    <div className="input">
                      <label htmlFor="linkedin_url">Linkedin URL</label>
                      <input id="linkedin_url" type="url" name="linkedin_url" placeholder="https://linkedin.com/in/johndoe" defaultValue={linkedin_url} />
                    </div>
                  </div>
                  <div className="input-group">
                    <div className="input">
                      <label htmlFor="twitter_url">Twitter URL</label>
                      <input id="twitter_url" type="url" name="twitter_url" placeholder="https://twitter.com/johndoe" defaultValue={twitter_url} />
                    </div>
                  </div>
                  <hr />
                  <div className="input-group">
                    <div className="input">
                      <label htmlFor="username">Username</label>
                      <input title="Changing username is not currently supported" id="username" type="text" name="username" placeholder="johndoe" defaultValue={username} readOnly={true} />
                    </div>
                  </div>
                </article>

                <article className="card">
                  <h3 className="title">Notifications</h3>
                  <div className="input-group">
                    <div className="input">
                      You'll receive notifications about:
                  </div>
                  </div>
                  <div className="input-group">
                    <div className="input">
                      {this.renderNotifications()}
                    </div>
                  </div>
                </article>
              </div>

              <div className="column column-1-2">
                <article className="card">
                  <h3 className="title">Bio</h3>
                  <textarea rows="6" name="bio" id="bio" defaultValue={bio} placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."></textarea>
                </article>

                <article className="card">
                  <h3 className="title">Skills</h3>
                  <textarea rows="3" name="skills" id="skills" defaultValue={skills.join(', ')} placeholder="React, Gatsby, Node, Express, PostgreSQL, MongoDB"></textarea>
                </article>
              </div>
            </div>
          </div>

        </div>
      </form>
    );
  }
}
