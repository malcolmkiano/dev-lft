import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProjectDashService from '../../services/project-dash-service';
import Avatar from '../Avatar';
import Button from '../Button';
import UserContext from '../../contexts/UserContext';

// images
import { CloseIcon } from '../../images';

class Vacancies extends Component {
  static defaultProps = {
    vacancies: []
  };
  static contextType = UserContext;

  handleRemoveMember = vacancy_id => {
    if (
      prompt(
        'Are you sure you want to remove this member? Type "remove" to confirm '
      ) !== 'remove'
    ) {
      return;
    }

    let user_id = null;
    let { project_id } = this.props;
    ProjectDashService.patchVacancy(vacancy_id, user_id)
      .then(() => {
        ProjectDashService.getVacancies(project_id).then(vacancies => {
          this.props.setVacancies(vacancies);
        });
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  handleDeleteVacancy = vacancy_id => {
    if (
      prompt(
        'Are you sure you want to delete this vacancy? Type "delete" to confirm '
      ) !== 'delete'
    ) {
      return;
    }

    let { vacancies } = this.props;
    const filtered = vacancies.filter(item => item.id !== vacancy_id);
    ProjectDashService.deleteVacancy(vacancy_id)
      .then(() => {
        this.props.setVacancies(filtered);
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  renderVacancies = () => {
    let { userRole, vacancies, leavePosition = () => null } = this.props;
    let {
      user: { username }
    } = this.context;

    return vacancies ? (
      <ul className="vacancies">
        {vacancies.map(item => {
          return (
            <li key={item.id} className="user">
              <Avatar first_name={item.first_name} last_name={item.last_name} />
              <div className="content">
                <h4>
                  {item.username !== null ? (
                    <Link to={`/users/${item.username}`}>
                      {item.username !== username ? (
                        <>
                          {item.first_name} {item.last_name}
                        </>
                      ) : (
                        'You'
                      )}
                    </Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </h4>
                <p>{item.username ? item.title : 'This position is open'}</p>
              </div>

              {userRole === 'owner' ? (
                <Button
                  className="clear"
                  onClick={() =>
                    item.username
                      ? item.username === username
                        ? leavePosition(item.id)
                        : this.handleRemoveMember(item.id)
                      : this.handleDeleteVacancy(item.id)
                  }
                >
                  <CloseIcon
                    title={
                      item.username
                        ? item.username === username
                          ? 'Leave this position'
                          : 'Remove this member'
                        : 'Delete this position'
                    }
                  />
                </Button>
              ) : (
                ''
              )}

              {userRole === 'member' && item.username === username ? (
                <Button
                  className="clear"
                  onClick={() => leavePosition(item.id)}
                >
                  <CloseIcon title="Leave this position" />
                </Button>
              ) : (
                ''
              )}
            </li>
          );
        })}
        {!vacancies.length ? (
          <li className="project">No team members, yet!</li>
        ) : (
          ''
        )}
      </ul>
    ) : (
      <p className="project">No vacancies at this time</p>
    );
  };

  render() {
    return (
      <article className="card">
        <h3 className="title">Team</h3>
        {this.renderVacancies()}
      </article>
    );
  }
}
export default Vacancies;
