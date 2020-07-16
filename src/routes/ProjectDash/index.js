import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import ProjectDashService from '../../services/project-dash-service';
import Info from '../../components/Info';
import Posts from '../../components/Posts';
import ProjectLinks from '../../components/ProjectLinks';
import Vacancies from '../../components/Vacancies';
import OpenVacancies from '../../components/OpenVacancies';
import Requests from '../../components/Requests';
import Button from '../../components/Button';
import UserContext from '../../contexts/UserContext';
import SocketContext from '../../contexts/SocketContext';
import './ProjectDash.css';

// images
import { CloseIcon } from '../../images';

class ProjectDash extends Component {
  static defaultProps = {
    history: {
      push: () => null
    },
    match: {
      params: {
        project_handle: null
      }
    }
  };

  static contextType = UserContext;

  state = {
    project: {},
    vacancies: [],
    requests: [],
    error: null
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const project_handle = this.props.match.params.project_handle;
    this.context.startLoading();

    try {
      const project = await ProjectDashService.getProject(project_handle);
      this.setState({ project });

      const vacancies = await ProjectDashService.getVacancies(project.id);
      this.setState({ vacancies });

      if (project.userRole === 'owner') {
        const requests = await ProjectDashService.getRequests(project.id);
        this.setState({ requests });
      }
    } catch (res) {
      this.setState({
        error: res.error || 'Something went wrong. Please try again later'
      });
    }
    this.context.stopLoading();
  }

  // Here be props, we must call back
  setVacancies = vacancies => {
    this.setState({ vacancies });
  };
  setRequests = requests => {
    this.setState({ requests });
  };

  handleDeleteProject = e => {
    e.preventDefault();
    if (
      prompt(
        'Are you sure you want to delete this project? Type "delete my project" to confirm'
      ) !== 'delete my project'
    ) {
      return;
    }

    let project_id = this.state.project.id;

    ProjectDashService.deleteProject(project_id)
      .then(() => {
        this.setState({
          project: []
        });
        this.props.history.push('/projects');
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  handleLeavePosition = vacancy_id => {
    if (
      prompt(
        'Are you sure you want to leave this position? Type "leave" to confirm'
      ) !== 'leave'
    ) {
      return;
    }

    // set user_id to null to update server
    let user_id = null;
    ProjectDashService.patchVacancy(vacancy_id, user_id)
      .then(() => {
        this.getData();
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  handleApprove = request_id => {
    let status = 'approved';
    let project_id = this.state.project.id;
    ProjectDashService.patchRequest(status, request_id)
      .then(() => {
        ProjectDashService.getVacancies(project_id).then(vacancies => {
          this.setState({
            vacancies
          });
        });
      })
      .then(() => {
        ProjectDashService.getRequests(project_id).then(requests => {
          this.setState({
            requests
          });
        });
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  handleDecline = request_id => {
    let status = 'denied';
    let project_id = this.state.project.id;

    ProjectDashService.patchRequest(status, request_id)
      .then(() => {
        ProjectDashService.getRequests(project_id).then(requests => {
          this.setState({
            requests
          });
        });
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  dismissErrorMsg = () => {
    this.setState({
      error: null
    });
  };

  requireAuth = () => {
    this.props.history.push({
      pathname: '/login',
      state: {
        error: 'You must be logged in to perform this action',
        from: this.props.location
      }
    });
  };

  render() {
    let {
      project,
      project: { userRole },
      error
    } = this.state;
    if (!project) {
      return <p>Could not find this project</p>;
    }
    return (
      <section className=" page project-dash">
        <Helmet>
          <title>{`${project.name || 'Project Dashboard'}`} - Dev LFT</title>
        </Helmet>

        <h1 className="hidden" aria-hidden={true}>
          {project.name}
        </h1>

        <header>
          <div className="wrapper">
            <h2>{project.name}</h2>
          </div>
        </header>

        <div className="page-content">
          <div className="wrapper">
            {error ? (
              <div role="alert" className="info card error">
                <p>{error}</p>
                <Button className="clear" onClick={this.dismissErrorMsg}>
                  <CloseIcon />
                </Button>
              </div>
            ) : (
              ''
            )}

            {userRole === 'member' || userRole === 'owner' ? (
              <SocketContext.Consumer>
                {socket => <Posts project_id={project.id} webSocket={socket} />}
              </SocketContext.Consumer>
            ) : (
              ''
            )}

            <div className="grid">
              <div className="column column-1-2">
                {userRole === 'owner' ? (
                  <Requests
                    requests={this.state.requests}
                    handleDecline={this.handleDecline}
                    handleApprove={this.handleApprove}
                    project_id={project.id}
                  />
                ) : (
                  ''
                )}

                <Info project={project} />
              </div>

              <div className="column column-1-2">
                {userRole !== 'user' && (
                  <ProjectLinks
                    github={project.github_url}
                    live={project.live_url}
                    trello={project.trello_url}
                  />
                )}

                {this.state.project.id && (
                  <Vacancies
                    project_id={project.id}
                    userRole={userRole}
                    vacancies={this.state.vacancies}
                    setVacancies={this.setVacancies}
                    leavePosition={this.handleLeavePosition}
                  />
                )}
              </div>
            </div>

            <OpenVacancies
              onInteract={this.requireAuth}
              setRequests={this.setRequests}
              setVacancies={this.setVacancies}
              handleApprove={this.handleApprove}
              vacancies={this.state.vacancies}
              requests={this.state.requests}
              project_id={project.id}
              userRole={userRole}
            />

            {userRole === 'owner' ? (
              <div className="centered">
                <Button onClick={this.handleDeleteProject} className="clear">
                  Delete Project
                </Button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </section>
    );
  }
}

ProjectDash.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      folder_id: PropTypes.number
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default ProjectDash;
