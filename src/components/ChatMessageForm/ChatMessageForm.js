import React, { Component } from 'react';
import ChatService from '../../services/chat-service';
import './ChatMessageForm.css';

class ChatMessageForm extends Component {
  static defaultProps = {
    recipient_id: null,
    project_id: null
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
    const { recipient_id, project_id } = this.props;
    const newMessage = {
      body,
      recipient_id,
      project_id
    };
    ChatService.postChatMessage(newMessage)
      .then(res => {
        this.setState({ error: null, body: '' });
        return this.props.setNewMessage({
          ...res.resultingMessage,
          isAuthor: true
        });
      })
      .catch(error => this.setState({ error }));
  };

  render() {
    const { error } = this.state;
    return (
      <form className="ChatMessageForm" onSubmit={e => this.onSend(e)}>
        <div role="alert">{error && <p>{error.error}</p>}</div>
        <label htmlFor="body">Reply:</label>
        <input
          type="text"
          id="body"
          name="body"
          required
          value={this.state.body}
          onChange={e => this.setBody(e.target.value)}
        ></input>
        <button type="submit">Send</button>
      </form>
    );
  }
}
export default ChatMessageForm;
