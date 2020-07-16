import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import ProjectApiService from '../../services/project-api-service';
import './ProjectForm.css';

// images
import { CloseIcon } from '../../images';

export default class ProjectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: {}, // using an object to easily prevent duplicates
      currentTag: '',
      tagError: null,
      error: null
    };
  }

  handleChange = event => {
    const input = event.target.value;
    this.setState({ currentTag: input, tagError: null });
  };

  handleKeypress = event => {
    if (event.key === ',' || event.key === 'Enter') {
      event.preventDefault();
      this.validateNewTag();
    }
  };

  validateNewTag = (context = 'input') => {
    const { tags } = this.state;
    const newTag = this.state.currentTag.trim();

    if (context === 'blur' && !newTag) return;

    // validation (won't add a tag unless it meets length requirements)
    // also won't add a tag if we've hit the maximum
    let tagError = false;
    if (newTag.length < 2) {
      tagError = 'Each tag must have at least 2 characters';
    } else if (newTag.length > 30) {
      tagError = 'Each tag must be less than 30 characters';
    } else if (Object.keys(tags).length >= 10) {
      tagError = 'You can add a maximum of 10 tags';
    }

    if (tagError) return this.setState({ tagError, currentTag: newTag.trim() });

    tags[newTag.toUpperCase()] = true;

    this.setState({
      tags,
      currentTag: ''
    });
  };

  handleRemoveTag = tag => {
    let { tags } = this.state;
    delete tags[tag];
    this.setState({ tags });
  };

  makeAddedList() {
    const tags = Object.keys(this.state.tags);
    const elements = tags.map((tag, index) => (
      <li
        role="button"
        className="tag"
        key={index}
        onClick={() => this.handleRemoveTag(tag)}
      >
        <span title={tag}>{tag}</span> <CloseIcon title="Remove this tag" />
      </li>
    ));
    return elements.length ? <ul className="tags">{elements}</ul> : '';
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      project_name,
      description,
      live_url,
      trello_url,
      github_url
    } = e.target;
    const tags = Object.keys(this.state.tags);
    ProjectApiService.postProject(
      project_name.value,
      description.value,
      tags,
      live_url.value,
      trello_url.value,
      github_url.value
    )
      .then(() => {
        this.props.onCreate();
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  render() {
    const { tagError, currentTag } = this.state;
    return (
      <form
        role="alert"
        className="project-form card"
        onSubmit={this.handleSubmit}
        autoComplete="off"
      >
        <div className="project">
          <div className="project-left">
            <div className="input-group name-input">
              <div className="input">
                <label htmlFor="project_name">Project Name *</label>
                <input
                  autoFocus
                  placeholder="New Project"
                  minLength="2"
                  maxLength="30"
                  type="text"
                  name="project_name"
                  id="project_name"
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <label htmlFor="description">Project Description *</label>
                <textarea
                  rows="8"
                  name="description"
                  id="description"
                  required
                  minLength="10"
                  maxLength="255"
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="project-right">
            <div className="input-group">
              <div className="input">
                <label htmlFor="add">Tags</label>
                <input
                  id="add"
                  type="text"
                  name="tagvalue"
                  autoComplete="off"
                  placeholder="Comma separated list"
                  minLength="3"
                  maxLength="30"
                  onChange={this.handleChange}
                  onBlur={() => this.validateNewTag('blur')}
                  onKeyPress={this.handleKeypress}
                  value={currentTag}
                />
                {tagError ? (
                  <p role="alert" className="error tag-error">
                    {tagError}
                  </p>
                ) : (
                  ''
                )}
                {this.makeAddedList()}
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <label htmlFor="live_url">Live URL</label>
                <input
                  type="url"
                  name="live_url"
                  placeholder="https://newproject.com"
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <label htmlFor="trello_url">Trello URL</label>
                <input
                  type="url"
                  name="trello_url"
                  placeholder="https://trello.com/b/new-project"
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <label htmlFor="live_url">GitHub URL</label>
                <input
                  type="url"
                  name="github_url"
                  placeholder="https://github.com/user/new-project"
                />
              </div>
            </div>
          </div>
        </div>

        {this.state.error ? (
          <p role="alert" className="project error">
            {this.state.error}
          </p>
        ) : (
          ''
        )}

        <Button type="submit">Create Project</Button>
        <Button className="clear" onClick={this.props.onCancel}>
          Cancel
        </Button>
      </form>
    );
  }
}

ProjectForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
