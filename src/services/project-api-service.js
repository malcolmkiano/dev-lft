import TokenService from './token-service';
import config from '../config';

const ProjectApiService = {
  getAllProjects() {
    return fetch(`${config.API_ENDPOINT}/projects`, {
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getAllUserProjects() {
    return fetch(`${config.API_ENDPOINT}/projects/user`, {
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getAllVacanciesForAProject(project_id) {
    return fetch(`${config.API_ENDPOINT}/vacancies/${project_id}`, {
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getProject(project_id) {
    return fetch(`${config.API_ENDPOINT}/projects/${project_id}`, {
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  editProject(
    name,
    description,
    tags,
    live_url,
    trello_url,
    github_url,
    project_id
  ) {
    return fetch(`${config.API_ENDPOINT}/project/${project_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        name,
        description,
        tags,
        live_url,
        trello_url,
        github_url
      })
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  deleteProject(project_id) {
    return fetch(`${config.API_ENDPOINT}/projects/${project_id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getMyProjects() {
    return fetch(`${config.API_ENDPOINT}/projects/user`, {
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  postProject(name, description, tags, live_url, trello_url, github_url) {
    return fetch(`${config.API_ENDPOINT}/projects`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        name,
        description,
        tags,
        live_url,
        trello_url,
        github_url
      })
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  }
};

export default ProjectApiService;
