import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ChatService from '../../services/chat-api-service';
import NotificationsApiService from '../../services/notification-api-service';
import Button from '../Button';
import './Notifications.css';

// images
import { BellIcon } from '../../images';

class Notifications extends Component {
  state = {
    notifications: [],
    isOpen: false,
    interval_id: null
  };

  componentDidMount() {
    this.getNotifications(true);
    const checkNotifications = setInterval(() => {
      this.getNotifications();
    }, 30000);
    this.setState({ interval_id: checkNotifications });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval_id);
  }

  componentDidUpdate() {
    // update favicon
    const { notifications } = this.state;
    const favicon = document.getElementById('favicon');
    const newIcon = notifications.length ? 'favicon-alert.png' : 'favicon.png';
    if (favicon) favicon.href = newIcon;
  }

  toggleNotificationsPopup = () => {
    let { notifications, isOpen } = this.state;

    this.setState({ isOpen: !isOpen });

    // send patch request on close
    if (isOpen && notifications.length) this.markAsSeen();
  };

  getNotifications = () => {
    NotificationsApiService.getNotifications()
      .then(notifications => {
        this.setState({ notifications });
      })
      .catch(res => {
        this.setState({ notifications: [res.error || res.message] });
      });
  };

  markAsSeen() {
    NotificationsApiService.patchNotifications().then(this.getNotifications);
  }

  formatNotification = notification => {
    let notificationText = `Somebody ${notification.type}ed ${notification.name}`;
    let notificationTime = ChatService.getFormattedDate(
      notification.date_created
    );
    let notificationLink = `/projects/${notification.handle}`;

    if (notification.type === 'chat') {
      notificationText = `New chat message from ${notification.name}`;
      notificationLink = {
        pathname: `/chats`,
        state: {
          filter: notification.name
        }
      };
    } else if (notification.type === 'leave') {
      notificationText = `Someone left ${notification.name}`;
    } else if (notification.type === 'post') {
      notificationText = `Someone posted in ${notification.name}`;
    }

    return (
      <Link to={notificationLink} onClick={this.toggleNotificationsPopup}>
        {notificationText}!<span className="time">{notificationTime}</span>
      </Link>
    );
  };

  renderNotifications = () => {
    let { notifications } = this.state;
    if (!notifications) {
      return <p>Couldn't find any notifications</p>;
    }

    return notifications.length ? (
      notifications.map((item, i) => {
        return <li key={i}>{this.formatNotification(item)}</li>;
      })
    ) : (
      <li>Nothing to see here!</li>
    );
  };

  render() {
    const { isOpen, notifications } = this.state;
    return (
      <div
        className={`notifications ${
          !isOpen && notifications.length ? 'new' : ''
        }`}
      >
        <Button
          className={`clear ${isOpen ? 'open' : ''}`}
          onClick={this.toggleNotificationsPopup}
          title={`${notifications.length} notification${
            notifications.length !== 1 ? 's' : ''
          }`}
        >
          <BellIcon />
          <span className="hidden">Notifications</span>
        </Button>
        <ul
          aria-hidden={!isOpen}
          role={isOpen ? 'alert' : ''}
          className={`notifications-list card ${isOpen ? 'active' : ''}`}
        >
          {this.renderNotifications()}
        </ul>
      </div>
    );
  }
}

export default Notifications;
