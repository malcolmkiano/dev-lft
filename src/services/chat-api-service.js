import config from '../config';
import { format, differenceInHours } from 'date-fns';

const ChatService = {
  getFormattedDate(date) {
    const currentTime = new Date();
    const messageDate = new Date(date);
    const difference = differenceInHours(currentTime, messageDate);

    switch (true) {
      case difference < 24:
        return format(messageDate, 'hh:mmaa');
      case difference < 48:
        return `Yesterday, ${format(messageDate, 'hh:mmaa')}`;
      case difference < 168:
        return format(messageDate, 'EEEE - hh:mmaa');
      default:
        return format(messageDate, 'EEEE, MMM d - hh:mmaa');
    }
  },
  getChats() {
    return fetch(`${config.API_ENDPOINT}/chats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },
  getAllChatMessages(id) {
    return fetch(`${config.API_ENDPOINT}/chats/${id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },
  postChatMessage(newMessage) {
    return fetch(`${config.API_ENDPOINT}/chats`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`
      },
      body: JSON.stringify(newMessage)
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  }
};

export default ChatService;
