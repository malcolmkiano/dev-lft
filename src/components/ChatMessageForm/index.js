import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/';
import ChatService from '../../services/chat-api-service';
import './ChatMessageForm.css';

class ChatMessageForm extends Component {
  static defaultProps = {
    recipient_id: null,
    recipient_username: '',
    author_username: '',
    onNewMessage: () => null,
    disabled: false
  };

  state = {
    body: '',
    error: null
  };

  setBody = text => {
    this.setState({ body: text });
  };

  onSend = e => {
    e.preventDefault();
    this.setState({ error: null });

    const { body } = this.state;
    const { recipient_username, request_id } = this.props;
    const newMessage = {
      body,
      recipient_username,
      request_id
    };
    ChatService.postChatMessage(newMessage)
      .then(() => {
        this.setState({ error: null, body: '' });
        this.props.onNewMessage({
          ...newMessage,
          isAuthor: true,
          author_username: this.props.author_username,
          date_created: new Date()
        });
      })
      .catch(res => {
        console.error(res);
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  render() {
    const { error } = this.state;
    const { disabled } = this.props;
    return (
      <form
        className="chat-form"
        onSubmit={e => this.onSend(e)}
        autoComplete="off"
      >
        {error ? (
          <p role="alert" className="error">
            {error}
          </p>
        ) : (
          ''
        )}

        <div className="input-group pinned">
          <div className="input">
            <label className="hidden" htmlFor="body">
              Reply:
            </label>
            <input
              type="text"
              id="body"
              name="body"
              required
              placeholder="Say something"
              maxLength="280"
              disabled={disabled}
              value={this.state.body}
              onChange={e => this.setBody(e.target.value)}
            ></input>
          </div>
          <Button disabled={disabled} type="submit">
            Send
          </Button>
        </div>
      </form>
    );
  }
}

ChatMessageForm.propType = {
  recipient_id: PropTypes.number.isRequired,
  recipient_username: PropTypes.string.isRequired,
  author_username: PropTypes.string.isRequired,
  onNewMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ChatMessageForm;
