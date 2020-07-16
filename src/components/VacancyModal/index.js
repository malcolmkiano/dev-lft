import React from 'react';
import Button from '../Button';

// images
import { CloseIcon } from '../../images';

export default class VacancyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: {},
      currentSkill: '',
      skillError: null
    };
  }

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
    const { skills } = this.state;
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

    skills[newSkill.toUpperCase()] = true;

    this.setState({
      skills,
      currentSkill: ''
    });
  };

  handleRemoveSkill = skill => {
    let { skills } = this.state;
    delete skills[skill];
    this.setState({ skills });
  };

  makeAddedList() {
    const skills = Object.keys(this.state.skills);
    const elements = skills.map((skill, index) => (
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
    return elements.length ? <ul className="tags">{elements}</ul> : '';
  }

  handleSubmit = event => {
    event.preventDefault();
    const skills = Object.keys(this.state.skills);
    if (!skills.length)
      return this.setState({ skillError: 'Must provide at least 1 skill' });

    event.target['vacancy-skills'] = { value: skills.join(',') };

    this.props.onSubmitVacancy(event);
  };

  render() {
    const { onCloseVacancyModal, error } = this.props;
    const { currentSkill, skillError } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        className="open-position"
        name="add-vacancy-form"
        autoComplete="off"
      >
        {error ? (
          <p role="alert" className="error">
            {error}
          </p>
        ) : (
          ''
        )}
        <div className="project">
          <div className="project-left">
            <div className="input-group">
              <div className="input">
                <label htmlFor="vacancy-title">Role *</label>
                <input
                  autoFocus
                  name="vacancy-title"
                  id="vacancy-title"
                  minLength="2"
                  maxLength="30"
                  placeholder="New Role"
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <label htmlFor="vacancy-description">Description *</label>
                <textarea
                  rows="4"
                  name="vacancy-description"
                  id="vacancy-description"
                  minLength="10"
                  maxLength="255"
                  required
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="project-right">
            <div className="input-group">
              <div className="input">
                <label htmlFor="skill">Skills *</label>
                <input
                  id="skill"
                  type="text"
                  name="skill"
                  autoComplete="off"
                  placeholder="Comma separated list"
                  minLength="3"
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
              </div>
            </div>
          </div>
        </div>

        <Button type="submit">Submit</Button>
        <Button className="clear" onClick={onCloseVacancyModal}>
          Cancel
        </Button>
      </form>
    );
  }
}
