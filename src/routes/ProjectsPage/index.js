import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Button from '../../components/Button';
import ProjectForm from '../../components/ProjectForm';
import ProjectItem from '../../components/ProjectItem';
import ProjectApiService from '../../services/project-api-service';
import UserContext from '../../contexts/UserContext';

// images
import { PlusIcon } from '../../images';

export default class ProjectsPage extends Component {
  state = {
    projects: [],
    creating: false,
    error: null
  };

  static contextType = UserContext;

  componentDidMount() {
    this.getUserProjects();
  }

  getUserProjects() {
    this.context.startLoading();
    ProjectApiService.getAllUserProjects()
      .then(res => {
        this.setState({ projects: res });
        this.context.stopLoading();
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
        this.context.stopLoading();
      });
  }

  createNewProject = () => {
    this.setState({
      creating: true
    });
  };

  handleCreation = () => {
    this.getUserProjects();
    this.handleCreateCancelled();
  };

  handleCreateCancelled = () => {
    this.setState({
      creating: false
    });
  };

  render() {
    const { creating, error, projects } = this.state;

    return (
      <section className="page projects">
        <Helmet>
          <title>Your Projects - Dev LFT</title>
        </Helmet>

        <header>
          <div className="wrapper">
            <h2>Your Projects</h2>
            <Button
              disabled={creating}
              swap={PlusIcon}
              onClick={this.createNewProject}
            >
              Create new project
            </Button>
          </div>
        </header>

        <div className="page-content">
          <div className="wrapper">
            {creating ? (
              <ProjectForm
                onCreate={this.handleCreation}
                onCancel={this.handleCreateCancelled}
              />
            ) : (
              ''
            )}

            {error || projects.length === 0 ? (
              <div
                role="alert"
                className={`info card project ${error ? 'error' : ''}`}
              >
                <p>{error || 'No projects, yet!'}</p>
              </div>
            ) : (
              ''
            )}

            {projects.map((project, i) => {
              return <ProjectItem key={i} project={project} />;
            })}
          </div>
        </div>
      </section>
    );
  }
}

ProjectsPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  })
};
