import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears
} from 'date-fns';

class Info extends React.Component {
  static defaultProps = {
    project: {}
  };

  renderTags = tags => {
    if (!tags.length) {
      return;
    } else if (tags) {
      let tagsList = tags.map((tag, i) => {
        return (
          <li key={i} className="tag">
            <span title={tag}>{tag}</span>
          </li>
        );
      });
      return tagsList;
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
      output = 'today';
    } else if (diffInDays === 1) {
      output = 'yesterday';
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
        description = '',
        tags = [],
        date_created = new Date(),
        project_creator = {}
      }
    } = this.props;

    return (
      <article className="card project-info">
        <h3 className="title">Project Info</h3>
        <p className="description">{description}</p>
        <div className="user">
          <Avatar
            first_name={project_creator.first_name}
            last_name={project_creator.last_name}
          />
          <div className="content">
            <h4>
              <Link to={`/users/${project_creator.username}`}>
                {project_creator
                  ? `${project_creator.first_name} ${
                      project_creator.last_name && project_creator.last_name[0]
                    }`
                  : 'DevLFT User'}
              </Link>
            </h4>
            <p>Created {this.formatProjectDate(date_created)}</p>
          </div>
        </div>
        <ul className="tags">{this.renderTags(tags)}</ul>
      </article>
    );
  }
}

export default Info;
