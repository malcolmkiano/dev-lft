import TokenService from './token-service';
import config from '../config';

const NotificationsApiService = {
  getNotifications() {
    return fetch(`${config.API_ENDPOINT}/notifications`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  patchNotifications() {
    return fetch(`${config.API_ENDPOINT}/notifications`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res => (!res.ok ? Promise.reject(res) : res));
  }
};

export default NotificationsApiService;
