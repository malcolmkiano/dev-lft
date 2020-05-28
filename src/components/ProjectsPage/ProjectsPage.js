import React, { Component } from 'react';
import './ProjectPage.css';
import { Button, Section } from '../Utils/Utils';
import ProjectApiService from '../../services/project-api-service';
import ProjectItem from '../ProjectItem/ProjectItem';


export default class ProjectsPage extends Component {
  state = {
    projects: []
  }

  componentDidMount() {
    ProjectApiService.getAllUserProjects()
      .then(res => {
        this.setState({projects: res})
      })

  }

  render() {
    console.log('all projects with vacancies', this.state.projects);
    return (
      <Section className="projects-page">
        <Button className="start-project" onClick={e => {e.preventDefault(); this.props.history.push('/project-form')}}>Create a new project</Button>
        <h2>Projects i'm involved in:</h2>           
         {
         (this.state.projects.length !== 0)? 
         <div>{this.state.projects.map((project, i) => {
            return (<ProjectItem key={i} project={project}/>)
         })}
         </div>
          : 'No projects available!'
         }
      </Section>
    )
  }
}

