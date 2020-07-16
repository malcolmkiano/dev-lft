import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ChatService from '../../services/chat-api-service';
import ProjectDashService from '../../services/project-dash-service';
import UserContext from '../../contexts/UserContext';

import Avatar from '../Avatar';
import ChatMessageForm from '../ChatMessageForm';
import Button from '../Button';
import './ChatMessages.css';

// images
import { CloseIcon, CheckIcon, BackIcon } from '../../images';

class ChatMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
    this.chatList = React.createRef();
  }

  static contextType = UserContext;

  static defaultProps = {
    chat: {
      closed_status: false,
      messages: [],
      recipient: {
        first_name: 'John',
        last_name: 'Doe',
        recipient_username: 'username'
      },
      project: {
        project_name: 'Project Name',
        request_id: null,
        vacancy_name: 'Vacancy Name',
        isOwner: false,
        request_status: ''
      }
    },
    open: false,
    onClose: () => null,
    onUpdate: () => null,
    onNewMessageSuccess: () => null
  };

  componentDidUpdate(oldProps) {
    if (!this.props.chat.messages[0].body !== oldProps.chat.messages[0].body) {
      this.chatList.current.scrollTop = this.chatList.current.scrollHeight;
    }
  }

  handleRequest = (request_id, status) => {
    ProjectDashService.patchRequest(status, request_id)
      .then(this.props.onUpdate)
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  render() {
    const {
      chat: {
        closed_status,
        messages,
        recipient: { first_name, last_name, recipient_username },
        project: {
          project_name,
          request_id,
          vacancy_name,
          isOwner = false,
          request_status
        }
      },
      open,
      onClose = () => null
    } = this.props;

    const { error } = this.state;
    const { user } = this.context;

    const headerMessage = isOwner
      ? request_status === 'pending'
        ? `wants to fill your ${vacancy_name} position`
        : request_status === 'denied'
        ? `wanted to fill your ${vacancy_name} position`
        : vacancy_name
      : `You requested to fill their ${vacancy_name} position`;

    return (
      <section className={`chat-view ${open ? 'open' : ''}`}>
        {error ? (
          <div role="alert" className="card info error">
            {error}
          </div>
        ) : (
          ''
        )}

        <header>
          <div className="user">
            <Button className="clear tablet" onClick={onClose}>
              <BackIcon />
              <span className="hidden" aria-hidden={!open}>
                Back to chats list
              </span>
            </Button>
            <Avatar first_name={first_name} last_name={last_name} />
            <div className="content">
              <h4>
                <Link to={`/users/${recipient_username}`}>
                  {first_name} {last_name[0]}
                </Link>
              </h4>
              <p title={headerMessage}>
                <span className="highlight">({project_name})</span>
                {headerMessage}
              </p>
            </div>
            {isOwner && request_status === 'pending' ? (
              <>
                <Button
                  className="clear"
                  onClick={() => this.handleRequest(request_id, 'approved')}
                >
                  <CheckIcon title="Approve this request" />
                </Button>
                <Button
                  className="clear"
                  onClick={() => this.handleRequest(request_id, 'denied')}
                >
                  <CloseIcon title="Deny this request" />
                </Button>
              </>
            ) : (
              ''
            )}
          </div>
        </header>
        <ul className="chats" ref={this.chatList}>
          {[...messages].reverse().map(message => (
            <li
              key={message.author_username + message.date_created}
              className={`message ${message.isAuthor ? 'author' : ''}`}
            >
              <header>
                {message.isAuthor ? (
                  <>
                    <Avatar
                      first_name={user.first_name}
                      last_name={user.last_name}
                    />
                    <h4 className="h5">You</h4>
                  </>
                ) : (
                  <>
                    <Avatar first_name={first_name} last_name={last_name} />
                    <h4 className="h5">
                      {first_name} {last_name}
                    </h4>
                  </>
                )}
                <span className="date">
                  {ChatService.getFormattedDate(message.date_created)}
                </span>
              </header>
              <p className="body">{message.body}</p>
            </li>
          ))}
          {request_status !== 'pending' ? (
            <li className="info">Request {request_status}.</li>
          ) : closed_status ? (
            <li className="info">This chat has been closed.</li>
          ) : (
            ''
          )}
        </ul>
        <ChatMessageForm
          request_id={request_id}
          recipient_username={recipient_username}
          author_username={user.username}
          onNewMessage={this.props.onNewMessageSuccess}
          disabled={request_status !== 'pending' || closed_status}
        />
      </section>
    );
  }
}

ChatMessages.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.object
    })
  }),
  chat: PropTypes.shape({
    closed_status: PropTypes.bool,
    messages: PropTypes.array,
    recipient: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      recipient_username: PropTypes.string
    }),
    project: PropTypes.shape({
      project_name: PropTypes.string,
      request_id: PropTypes.number,
      vacancy_name: PropTypes.string,
      isOwner: PropTypes.bool,
      request_status: PropTypes.string
    })
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNewMessageSuccess: PropTypes.func.isRequired
};

export default ChatMessages;
