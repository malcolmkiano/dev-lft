import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import Button from '../Button';
import ChatModal from '../ChatModal';
import ProjectDashService from '../../services/project-dash-service';

// images
import { ChatIcon, CloseIcon, CheckIcon } from '../../images';

export default class Requests extends React.Component {
  state = {
    showChatModal: false,
    request: {},
    error: null
  };

  static defaultProps = {
    requests: [],
    handleDecline: () => null,
    handleApprove: () => null
  };

  handleOpenChatModal = request => {
    this.setState({
      showChatModal: true,
      request: request
    });
  };

  handleCloseChatModal = () => {
    this.setState({
      showChatModal: false,
      recipient_id: null
    });
  };

  handleNewMessage = e => {
    e.preventDefault();
    let {
      request: { username, id }
    } = this.state;
    let body = e.target['chat-message'].value;
    ProjectDashService.postChat(username, id, body)
      .then(this.handleCloseChatModal)
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  render() {
    const { requests, handleDecline, handleApprove } = this.props;
    const { request, error } = this.state;
    const pendingRequests = requests.filter(item => item.status === 'pending');

    return (
      <article className="card requests">
        <h3 className="title">Requests</h3>

        {this.state.showChatModal ? (
          <ChatModal
            handleNewMessage={this.handleNewMessage}
            handleCloseChatModal={this.handleCloseChatModal}
            request={request}
            error={error}
          />
        ) : (
          ''
        )}

        {!pendingRequests.length ? (
          <p className="project">No requests at this time.</p>
        ) : (
          <ul>
            {pendingRequests.map(request => (
              <li key={request.id} className="user request">
                <Avatar
                  first_name={request.first_name}
                  last_name={request.last_name}
                />
                <div className="content">
                  <h4>
                    <Link to={`/users/${request.username}`}>
                      {request.first_name} {request.last_name}
                    </Link>
                  </h4>
                  <p>wants to fill your {request.vacancy_title} position</p>
                </div>

                <div className="buttons">
                  <Button
                    className="clear"
                    onClick={() => this.handleOpenChatModal(request)}
                  >
                    <ChatIcon title="Message this user" />
                  </Button>
                  <Button
                    className="clear"
                    onClick={() => handleApprove(request.id)}
                  >
                    <CheckIcon title="Approve this request" />
                  </Button>
                  <Button
                    className="clear"
                    onClick={() => handleDecline(request.id)}
                  >
                    <CloseIcon title="Deny this request" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>
    );
  }
}
