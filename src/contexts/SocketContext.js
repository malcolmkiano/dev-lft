import React, { Component } from 'react';
import AuthApiService from '../services/auth-api-service';
import config from '../config';

const SocketContext = React.createContext({
  clientConnection: {},
  clientNotifications: [],
  clientChats: [],
  clientPosts: [],
  clientPatchedPosts: [],
  setAcceptChats: () => null,
  setAcceptPosts: () => null,
  handleMessage: () => null,
  clearClientNotifications: () => null,
  clearClientChats: () => null,
  clearClientPosts: () => null,
  clearClientPatchedPosts: () => null
});

export default SocketContext;

export class SocketProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientConnection: {},
      clientNotifications: [],
      clientChats: [],
      clientPosts: [],
      clientPatchedPosts: []
    };
  }

  static defaultProps = {
    isAuth: false
  };

  async componentDidMount() {
    if (this.props.isAuth) {
      this.getWebSocketConnection();
    }
  }

  async componentDidUpdate(oldProps) {
    if (this.props.isAuth && oldProps.isAuth !== true) {
      this.getWebSocketConnection();
    }
    if (oldProps.isAuth === true && this.props.isAuth === false) {
      this.state.clientConnection.close();
      this.setState({ clientConnection: {} });
    }
  }

  getWebSocketConnection = async () => {
    try {
      // First, get a new auth ticket from the server
      const webSocketTicket = await AuthApiService.getWebSocketTicket();
      // Then we send this up as part of our req params
      const clientConnection = new WebSocket(
        `${config.WEB_SOCKET_ENDPOINT}/${webSocketTicket.ticket}`
      );
      // On new message from server, send though message handler
      clientConnection.onmessage = msg => this.handleMessage(msg);
      this.setState({
        clientConnection
      });
    } catch (error) {
      this.setState({ error });
    }
  };

  componentWillUnmount() {
    // If there is a connection, close it.
    if (this.state.clientConnection.close) {
      this.state.clientConnection.close();
      this.setState({ clientConnection: {} });
    }
  }

  clearClientNotifications = () => this.setState({ clientNotifications: [] });
  clearClientChats = () => this.setState({ clientChats: [] });
  clearClientPosts = () => this.setState({ clientPosts: [] });
  clearClientPatchedPosts = () => this.setState({ clientPatchedPosts: [] });

  setAcceptChats = status =>
    this.state.clientConnection.send(
      JSON.stringify({ changeRoom: true, receiveChats: status })
    );

  setAcceptPosts = status =>
    this.state.clientConnection.send(
      JSON.stringify({
        changeRoom: true,
        receivePosts: status,
        receivePatchPosts: status
      })
    );

  handleMessage = message => {
    const messageData = JSON.parse(message.data);
    if (messageData.messageType === 'chat') {
      this.setState({
        clientChats: [messageData.content, ...this.state.clientChats]
      });
    }

    if (messageData.messageType === 'post') {
      this.setState({
        clientPosts: [messageData.content, ...this.state.clientPosts]
      });
    }

    if (messageData.messageType === 'post-patch') {
      this.setState({
        clientPatchedPosts: [
          messageData.content,
          ...this.state.clientPatchedPosts
        ]
      });
    }

    if (messageData.messageType === 'notification') {
      this.setState({
        clientNotifications: [
          messageData.content,
          ...this.state.clientNotifications
        ]
      });
    }
  };

  render() {
    const value = {
      clientConnection: this.state.clientConnection,
      clientNotifications: this.state.clientNotifications,
      clientChats: this.state.clientChats,
      clientPosts: this.state.clientPosts,
      clientPatchedPosts: this.state.clientPatchedPosts,
      setAcceptChats: this.setAcceptChats,
      setAcceptPosts: this.setAcceptPosts,
      clearClientChats: this.clearClientChats,
      clearClientPosts: this.clearClientPosts,
      clearClientPatchedPosts: this.clearClientPatchedPosts
    };

    return (
      <SocketContext.Provider value={value}>
        {this.props.children}
      </SocketContext.Provider>
    );
  }
}
