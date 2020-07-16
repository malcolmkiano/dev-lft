import config from '../config';
import TokenService from './token-service';

const ProjectDashService = {
  getProject(project_id) {
    return fetch(`${config.API_ENDPOINT}/projects/${project_id}`, {
      method: 'GET',
      headers: TokenService.hasAuthToken()
        ? {
            authorization: `Bearer ${TokenService.getAuthToken()}`
          }
        : {}
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getVacancies(project_id) {
    return fetch(`${config.API_ENDPOINT}/vacancies/${project_id}`, {
      method: 'GET',
      headers: TokenService.hasAuthToken()
        ? {
            authorization: `Bearer ${TokenService.getAuthToken()}`
          }
        : {}
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getRequests(project_id) {
    return fetch(`${config.API_ENDPOINT}/requests/${project_id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getPosts(project_id) {
    return fetch(`${config.API_ENDPOINT}/posts/${project_id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  postVacancies(title, description, skills, project_id) {
    return fetch(`${config.API_ENDPOINT}/vacancies/${project_id}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ title, description, skills })
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  patchVacancy(vacancy_id, user_id) {
    return fetch(`${config.API_ENDPOINT}/vacancies/${vacancy_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ user_id })
    }).then(res => (!res.ok ? res.json().then(e => Promise.reject(e)) : res));
  },

  deleteVacancy(vacancy_id) {
    return fetch(`${config.API_ENDPOINT}/vacancies/${vacancy_id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res => (!res.ok ? res.json().then(e => Promise.reject(e)) : res));
  },

  postRequest(vacancy_id) {
    return fetch(`${config.API_ENDPOINT}/requests/${vacancy_id}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  patchRequest(status, request_id) {
    return fetch(`${config.API_ENDPOINT}/requests/${request_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ status })
    }).then(res => (!res.ok ? res.json().then(e => Promise.reject(e)) : res));
  },

  postPost(project_id, message) {
    return fetch(`${config.API_ENDPOINT}/posts/${project_id}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ message })
    }).then(res => {
      return !res.ok ? res.json().then(e => Promise.reject(e)) : res.json();
    });
  },

  patchPost(post_id, message) {
    return fetch(`${config.API_ENDPOINT}/posts/${post_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ message })
    }).then(res => {
      // No json response unless error, so send back status
      return !res.ok ? res.json().then(e => Promise.reject(e)) : res.status;
    });
  },

  postChat(recipient_username, request_id, body) {
    return fetch(`${config.API_ENDPOINT}/chats`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ recipient_username, request_id, body })
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  deleteProject(project_id) {
    return fetch(`${config.API_ENDPOINT}/projects/${project_id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res => (!res.ok ? res.json().then(e => Promise.reject(e)) : res));
  }
};

export default ProjectDashService;
