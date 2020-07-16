import React, { Component } from 'react';
import Button from '../Button';
import ProjectDashService from '../../services/project-dash-service';
import VacancyModal from '../VacancyModal';
import UserContext from '../../contexts/UserContext';

// images
import { PlusIcon } from '../../images';

class OpenVacancies extends Component {
  static defaultProps = {
    vacancies: [],
    requests: [],
    project_id: null
  };

  state = {
    addingVacancy: false
  };

  static contextType = UserContext;

  onAddVacancy = () => {
    this.setState({
      addingVacancy: true,
      error: null
    });
  };

  onCancelVacancy = () => {
    this.setState({
      addingVacancy: false,
      error: null
    });
  };

  handleRequest = (vacancy_id, callback = () => null) => {
    const {
      user: { isAuth }
    } = this.context;
    let { requests, project_id, onInteract } = this.props;

    if (!isAuth) return onInteract();

    ProjectDashService.postRequest(vacancy_id)
      .then(res => {
        callback(res.id);
        requests.push(res);
        ProjectDashService.getVacancies(project_id).then(vacancies => {
          this.props.setVacancies(vacancies);
          this.props.setRequests(requests);
        });
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  handleSubmitVacancy = e => {
    let { project_id } = this.props;

    let title = e.target['vacancy-title'].value;
    let description = e.target['vacancy-description'].value;
    let skills = e.target['vacancy-skills'].value.split(',');
    ProjectDashService.postVacancies(title, description, skills, project_id)
      .then(() => {
        this.setState({ addingVacancy: false });
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

  renderOpenVacancies = () => {
    const { vacancies, userRole, handleApprove } = this.props;
    const openVacancies = vacancies.filter(item => item.username === null);
    const userRequests = vacancies.filter(item => item.request_status !== null);

    return (
      <>
        {openVacancies.length ? (
          <ul className="open-vacancies-list">
            {openVacancies.map(item => {
              let userRequest =
                userRequests.find(req => req.id === item.id) || null;
              return (
                <li className="project" key={item.id}>
                  <div className="project-left">
                    <h4 className="h3">{item.title}</h4>
                    <p className="description">{item.description}</p>
                  </div>
                  <div className="project-right">
                    <ul className="tags">{this.renderSkills(item.skills)}</ul>
                    <div>
                      <Button
                        className={userRequest ? 'clear' : ''}
                        disabled={!!userRequest}
                        onClick={() =>
                          !userRequest && userRole === 'owner'
                            ? this.handleRequest(item.id, handleApprove)
                            : this.handleRequest(item.id)
                        }
                      >
                        {userRequest
                          ? `Request ${userRequest.request_status}`
                          : userRole === 'owner'
                          ? 'Fill this position'
                          : 'Request to join'}
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="project">No open positions at this time.</p>
        )}
      </>
    );
  };

  renderSkills = skills => {
    return skills.map((element, i) => {
      return (
        <li className="tag tag-grey" key={i}>
          <span title={element}>{element}</span>
        </li>
      );
    });
  };

  render() {
    const { userRole } = this.props;
    const { addingVacancy, error } = this.state;
    return (
      <article className="card">
        <header className="title">
          <h3>Open Positions</h3>
          {userRole === 'owner' ? (
            <Button
              title="Add new position"
              className="clear"
              disabled={addingVacancy}
              onClick={this.onAddVacancy}
            >
              <PlusIcon />
              <span className="hidden">Add a new position</span>
            </Button>
          ) : (
            ''
          )}
        </header>

        {addingVacancy ? (
          <VacancyModal
            error={error}
            onSubmitVacancy={this.handleSubmitVacancy}
            onCloseVacancyModal={this.onCancelVacancy}
          />
        ) : (
          ''
        )}

        {this.renderOpenVacancies()}
      </article>
    );
  }
}

export default OpenVacancies;
