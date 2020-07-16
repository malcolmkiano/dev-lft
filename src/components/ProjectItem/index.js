import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears
} from 'date-fns';
import PropTypes from 'prop-types';
import './ProjectItem.css';

// images
import { CalendarIcon, VacanciesIcon } from '../../images';

export default class ProjectItem extends Component {
  static defaultProps = {
    project: {
      name: 'Best App everrr',
      tags: ['React']
    }
  };

  formatProjectDate = date => {
    const projectDate = new Date(date);
    const currentDate = new Date();
    const diffInDays = differenceInDays(currentDate, projectDate);
    let output = null,
      interval = 'day',
      number = 0;

    if (diffInDays === 0) {
      output = 'Today';
    } else if (diffInDays === 1) {
      output = 'Yesterday';
    } else if (diffInDays < 7) {
      interval = 'day';
      number = diffInDays;
    } else if (diffInDays < 30) {
      interval = 'week';
      number = differenceInWeeks(currentDate, projectDate);
    } else if (diffInDays < 365) {
      interval = 'month';
      number = differenceInMonths(currentDate, projectDate);
    } else {
      interval = 'year';
      number = differenceInYears(currentDate, projectDate);
    }

    if (output === null) {
      return `${number} ${interval}${number !== 1 ? 's' : ''} ago`;
    } else {
      return output;
    }
  };

  render() {
    const {
      project: {
        handle,
        name,
        description,
        tags = [],
        date_created,
        openVacancies = 0
      }
    } = this.props;
    return (
      <article className="project card">
        <div className="project-left">
          <h3>
            <Link to={`/projects/${handle}`}>{name}</Link>
          </h3>
          <p className="description">{description}</p>
        </div>
        <div className="project-right">
          <ul className="tags">
            {tags.map((tag, i) => {
              return (
                <li key={i} className="tag">
                  <span title={tag}>{tag}</span>
                </li>
              );
            })}
          </ul>
          <div>
            <div className="info-item">
              <CalendarIcon />
              <p>{this.formatProjectDate(date_created)}</p>
            </div>
            <div className="info-item">
              <VacanciesIcon />
              <p>
                {openVacancies} open position{+openVacancies !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </article>
    );
  }
}

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired
};
