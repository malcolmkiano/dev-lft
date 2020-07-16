import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ProjectApiService from '../../services/project-api-service';
import Carousel from '../../components/Carousel';
import Button from '../../components/Button';
import ProjectItem from '../../components/ProjectItem';
import './LandingPage.css';

// images
import BuidATeamPhoto from '../../images/build-a-team.jpg';
import BringYourToolsPhoto from '../../images/bring-your-tools.jpg';
import JoinATeamPhoto from '../../images/join-a-team.jpg';

export default class LandingPage extends Component {
  state = {
    projects: [],
    userCount: 11000
  };

  componentDidMount() {
    // get projects
    ProjectApiService.getAllProjects()
      .then(projects => {
        let projectsWithVacancies = projects.filter(
          project => project.openVacancies > 0
        );
        this.setState({
          // only the first 5 projects with open vacancies
          projects: projectsWithVacancies.slice(0, 5)
        });
      })
      .catch(console.error);
  }

  render() {
    let { projects } = this.state;
    return (
      <main className="landing-page">
        <Helmet>
          <title>Dev LFT | Side Projects Conquered</title>
        </Helmet>

        <section className="hero">
          <div className="wrapper">
            <h1>
              Side Projects
              <br />
              <em>Conquered.</em>
            </h1>
            <p>
              Take side projects from concept to completion with teams of
              passionate pros like yourself.
            </p>
            <Link to="/signup">
              <Button isLink={true}>Start Yours</Button>
            </Link>
          </div>
        </section>

        <section className="wrapper features">
          <div className="features-title">
            <h2>Features</h2>
            <div className="line-after"></div>
          </div>

          <article className="grid">
            <img
              className="column column-1-2"
              src={BuidATeamPhoto}
              alt="team looking at a board with post-its"
            />
            <div className="column column-1-2">
              <h3>Build a team</h3>
              <p>
                Find great developers and designers to turn your project idea
                into a reality.
              </p>
            </div>
          </article>

          <article className="grid">
            <img
              className="column column-1-2"
              src={BringYourToolsPhoto}
              alt="a screenshot of the GitHub workflow"
            />
            <div className="column column-1-2">
              <h3>Bring your tools</h3>
              <p>
                Keep your existing workflow with integrations like GitHub,
                Trello and more to come.
              </p>
            </div>
          </article>

          <article className="grid">
            <img
              className="column column-1-2"
              src={JoinATeamPhoto}
              alt="a team working with laptops and phones"
            />
            <div className="column column-1-2">
              <h3>Join a team</h3>
              <p>
                Lend your expertise in design or development to others working
                on the next big thing.
              </p>
            </div>
          </article>
        </section>

        {projects.length ? (
          <section className="projects">
            <div className="wrapper">
              <h2 className="h3">
                Projects that could use
                <br />
                someone like you
              </h2>
              <Carousel>
                {projects.map(project => (
                  <ProjectItem key={project.id} project={project} />
                ))}
              </Carousel>
              <Link to="/feed">
                <Button isLink={true}>See all projects</Button>
              </Link>
            </div>
          </section>
        ) : (
          ''
        )}

        <section className="cta">
          <h2>
            What are you
            <br />
            waiting for?
          </h2>
          <p>
            Start using Dev LFT now
            <br />
            and crush your side projects.
          </p>
          <Link to="/signup">
            <Button isLink={true}>Get #LFTed</Button>
          </Link>
        </section>
      </main>
    );
  }
}
