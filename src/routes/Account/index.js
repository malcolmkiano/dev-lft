import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
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
      error: null,
      skills: {},
      skillError: null,
      currentSkill: ''
    };

    this.accountForm = React.createRef();
  }

  static contextType = UserContext;

  static defaultProps = {
    history: {
      push: () => null
    }
  };

  handleChange = event => {
    const input = event.target.value;
    this.setState({ currentSkill: input, skillError: null });
  };

  handleKeypress = event => {
    if (event.key === ',' || event.key === 'Enter') {
      event.preventDefault();
      this.validateNewSkill();
    }
  };

  validateNewSkill = (context = 'input') => {
    const {
      user: { skills }
    } = this.context;
    const newSkill = this.state.currentSkill.trim();

    if (context === 'blur' && !newSkill) return;

    // validation (won't add a skills unless it meets length requirements)
    // also won't add a skills if we've hit the maximum
    let skillError = false;
    if (newSkill.length < 2) {
      skillError = 'Each skill must have at least 2 characters';
    } else if (newSkill.length > 30) {
      skillError = 'Each skill must be less than 30 characters';
    } else if (Object.keys(skills).length >= 10) {
      skillError = 'You can add a maximum of 10 tags';
    }

    if (skillError)
      return this.setState({ skillError, currentSkill: newSkill.trim() });
    const updatedSkills = {};
    if (skills) {
      skills.forEach(skill => {
        updatedSkills[skill] = true;
      });
    }
    updatedSkills[newSkill.toUpperCase()] = true;

    this.setState({
      currentSkill: ''
    });

    const newSkills = Object.keys(updatedSkills);
    this.context.setSkills(newSkills);
  };

  handleRemoveSkill = skill => {
    let {
      user: { skills }
    } = this.context;

    const currentSkills = {};
    if (skills) {
      skills.forEach(skill => {
        currentSkills[skill] = true;
      });
    }
    delete currentSkills[skill];

    const newSkills = Object.keys(currentSkills);
    this.context.setSkills(newSkills);
    this.handleFormEntry();
  };

  makeAddedList() {
    const {
      user: { skills }
    } = this.context;
    const elements =
      skills &&
      skills.map((skill, index) => (
        <li
          role="button"
          className="tag tag-grey"
          key={index}
          onClick={() => this.handleRemoveSkill(skill)}
        >
          <span title={skill}>{skill}</span>{' '}
          <CloseIcon title="Remove this skill" />
        </li>
      ));
    return elements && elements.length ? (
      <ul className="tags">{elements}</ul>
    ) : (
      ''
    );
  }

  handleUpdate = event => {
    event.preventDefault();

    const {
      first_name,
      last_name,
      github_url,
      linkedin_url,
      twitter_url,
      notifications,
      bio
    } = event.target;

    const {
      user: { skills }
    } = this.context;

    const notificationPrefs = Array.prototype.slice
      .call(notifications)
      .filter(input => input.checked)
      .map(input => input.value);

    const updatedInfo = {
      first_name: first_name.value,
      last_name: last_name.value,
      github_url: github_url.value,
      linkedin_url: linkedin_url.value,
      twitter_url: twitter_url.value,
      notifications: notificationPrefs,
      bio: bio.value.trim(),
      skills
    };

    bio.value = bio.value.trim();

    this.context.startLoading();
    AuthApiService.updateUserInfo(updatedInfo)
      .then(() => {
        this.setState({ updateSuccess: true, formDirty: false });
        this.context.onProfileUpdate(updatedInfo);
        this.context.stopLoading();
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
        this.context.stopLoading();
      });
  };

  dismissSuccessMsg = () => {
    this.setState({ updateSuccess: false, error: null });
  };

  handleFormEntry = () => {
    this.setState({ formDirty: true });
  };

  handleNotificationChange = e => {
    const { value, checked } = e.target;
    let notifications = [...this.context.user.notifications];
    const newNotificationSettings = !checked
      ? notifications.filter(n => n !== value)
      : [...notifications, value];

    this.context.setNotifications(newNotificationSettings);
  };

  renderNotifications = () => {
    const {
      user: { notifications = [] }
    } = this.context;
    const notificationTypes = [
      { type: 'chat', description: 'New chat messages' },
      { type: 'join', description: 'People joining your teams' },
      { type: 'leave', description: 'People leaving your teams' },
      {
        type: 'post',
        description: "New posts to your teams' discussion boards"
      }
    ];

    return notificationTypes.map(({ type, description }, i) => (
      <label className="check" key={i}>
        <input
          name="notifications"
          checked={notifications.includes(type)}
          onChange={this.handleNotificationChange}
          value={type}
          type="checkbox"
        />
        <span>{description}</span>
      </label>
    ));
  };

  handleLogOut() {
    const { onLogOut = () => null } = this.context;
    onLogOut();
    this.props.history.push('/');
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
        bio
      }
    } = this.context;

    const { formDirty, error, currentSkill, skillError } = this.state;

    return (
      <form
        className="page account"
        onSubmit={this.handleUpdate}
        onInput={this.handleFormEntry}
        ref={this.accountForm}
      >
        <Helmet>
          <title>Your Account - Dev LFT</title>
        </Helmet>

        <h1 className="hidden" aria-hidden={true}>
          Your Account
        </h1>

        <header>
          <div className="wrapper">
            <h2>Your Account</h2>
            <Button swap={SaveIcon} disabled={!formDirty} type="submit">
              Save changes
            </Button>
          </div>
        </header>

        <div className="page-content">
          <div className="wrapper">
            {this.state.updateSuccess || error ? (
              <div role="alert" className={`info card ${error ? 'error' : ''}`}>
                <p>{error ? error : 'Your profile has been updated'}</p>
                <Button className="clear" onClick={this.dismissSuccessMsg}>
                  <CloseIcon />
                </Button>
              </div>
            ) : (
              ''
            )}

            <div className="grid">
              <div className="column column-1-2">
                <article className="card" spellCheck={false}>
                  <h3 className="title">Profile</h3>
                  <div className="input-group">
                    <div className="input">
                      <label htmlFor="first_name">First name *</label>
                      <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        minLength="2"
                        maxLength="30"
                        required
                        placeholder="John"
                        defaultValue={first_name}
                      />
                    </div>
                    <div className="input">
                      <label htmlFor="last_name">Last name *</label>
                      <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        minLength="2"
                        maxLength="30"
                        required
                        placeholder="Doe"
                        defaultValue={last_name}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <div className="input">
                      <label htmlFor="github_url">GitHub URL</label>
                      <input
                        id="github_url"
                        type="url"
                        name="github_url"
                        maxLength="255"
                        placeholder="https://github.com/johndoe"
                        defaultValue={github_url}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <div className="input">
                      <label htmlFor="linkedin_url">Linkedin URL</label>
                      <input
                        id="linkedin_url"
                        type="url"
                        name="linkedin_url"
                        maxLength="255"
                        placeholder="https://linkedin.com/in/johndoe"
                        defaultValue={linkedin_url}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <div className="input">
                      <label htmlFor="twitter_url">Twitter URL</label>
                      <input
                        id="twitter_url"
                        type="url"
                        name="twitter_url"
                        maxLength="255"
                        placeholder="https://twitter.com/johndoe"
                        defaultValue={twitter_url}
                      />
                    </div>
                  </div>
                  <hr />
                  <Link to={`/users/${username}`} className="profile-link">
                    <Button className="clear" isLink={true}>
                      View profile
                    </Button>
                  </Link>
                </article>

                <fieldset className="card">
                  <h3 className="title">
                    <legend>Notifications</legend>
                  </h3>
                  <div className="input-group">
                    <div className="input">
                      You'll receive notifications about:
                    </div>
                  </div>
                  <div className="input-group">
                    <div className="input">{this.renderNotifications()}</div>
                  </div>
                </fieldset>
              </div>

              <div className="column column-1-2">
                <article className="card">
                  <h3 className="title">
                    <label htmlFor="bio">Bio</label>
                  </h3>
                  <textarea
                    rows="6"
                    name="bio"
                    id="bio"
                    defaultValue={bio && bio.trim()}
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    minLength="30"
                    maxLength="500"
                  ></textarea>
                </article>

                <article className="card">
                  <h3 className="title">
                    <label htmlFor="skill">Skills</label>
                  </h3>
                  <input
                    id="skill"
                    type="text"
                    name="skill"
                    autoComplete="off"
                    placeholder="Comma separated list"
                    minLength="2"
                    maxLength="30"
                    onChange={this.handleChange}
                    onBlur={() => this.validateNewSkill('blur')}
                    onKeyPress={this.handleKeypress}
                    value={currentSkill}
                  />
                  {skillError ? (
                    <p role="alert" className="error skill-error">
                      {skillError}
                    </p>
                  ) : (
                    ''
                  )}
                  {this.makeAddedList()}
                </article>
              </div>
            </div>

            <div className="centered">
              <Button
                onClick={() => this.handleLogOut()}
                className="clear desktop"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
