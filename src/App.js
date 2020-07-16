import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from './utils/PrivateRoute';
import PublicOnlyRoute from './utils/PublicOnlyRoute';

import GlobalErrorBoundary from './components/ErrorBoundary';
import Nav from './components/Nav/';
import Footer from './components/Footer';

import LandingPage from './routes/LandingPage';
import ProjectsPage from './routes/ProjectsPage';
import FeedPage from './routes/FeedPage';
import Login from './routes/Login';
import Signup from './routes/Signup';
import UserProfile from './routes/UserProfile';
import Chat from './routes/Chat';
import Account from './routes/Account';
import ProjectDash from './routes/ProjectDash';
import PageNotFound from './routes/PageNotFound';

import UserContext from './contexts/UserContext';
import SocketContext, { SocketProvider } from './contexts/SocketContext';
import TokenService from './services/token-service';
import AuthApiService from './services/auth-api-service';

export default class App extends Component {
  state = {
    user: {
      username: '',
      first_name: '',
      last_name: '',
      github_url: '',
      linkedin_url: '',
      twitter_url: '',
      date_created: '',
      isAuth: false
    },
    isLoading: false,
    error: null
  };

  componentDidMount() {
    this.handleAuth();
  }

  handleAuth = () => {
    if (TokenService.hasAuthToken()) {
      AuthApiService.getUserProfile()
        .then(user => {
          this.setState({ user: { ...user, isAuth: true }, isLoading: false });
        })
        .catch(res => {
          this.setState(
            {
              error:
                res.error || 'Something went wrong. Please try again later',
              user: { isAuth: false },
              isLoading: false
            },
            () => {
              throw new Error(this.state.error);
            }
          );
        });
    } else {
      this.setState({ user: { isAuth: false } });
    }
  };

  handleSetLoading = (loadingState = false) => {
    this.setState({
      isLoading: loadingState
    });
  };

  handleLogOut = () => {
    TokenService.clearAuthToken();
    this.handleAuth();
  };

  handleUserUpdate = updatedFields => {
    this.setState({ user: { ...this.state.user, ...updatedFields } });
  };

  handleSetNotificaions = notificationSettings => {
    this.setState({
      user: { ...this.state.user, notifications: notificationSettings }
    });
  };

  handleSetSkills = skills => {
    this.setState({ user: { ...this.state.user, skills } });
  };

  render() {
    const {
      user,
      isLoading,
      user: { isAuth }
    } = this.state;
    const contextValues = {
      user,
      onAuth: this.handleAuth,
      onLogOut: this.handleLogOut,
      onProfileUpdate: this.handleUserUpdate,
      setNotifications: this.handleSetNotificaions,
      setSkills: this.handleSetSkills,
      startLoading: () => this.handleSetLoading(true),
      stopLoading: () => this.handleSetLoading(false)
    };

    return (
      <UserContext.Provider value={contextValues}>
        <SocketProvider isAuth={isAuth}>
          <Route path="*" component={Nav} />
          <GlobalErrorBoundary>
            <Switch>
              <PublicOnlyRoute exact path="/" component={LandingPage} />
              <PublicOnlyRoute exact path="/signup" component={Signup} />
              <PublicOnlyRoute exact path="/login" component={Login} />
              <Route exact path="/feed" component={FeedPage} />
              <Route
                exact
                path="/projects/:project_handle"
                component={ProjectDash}
              />
              <PrivateRoute exact path="/account" component={Account} />
              <PrivateRoute exact path="/projects" component={ProjectsPage} />
              <PrivateRoute
                exact
                path="/users/:username"
                component={UserProfile}
              />
              <PrivateRoute
                exact
                path="/chats"
                component={() => (
                  <SocketContext.Consumer>
                    {socket => <Chat webSocket={socket} />}
                  </SocketContext.Consumer>
                )}
              />
              <Route path="*" component={PageNotFound} />
            </Switch>
          </GlobalErrorBoundary>
          <Route path="*" component={Footer} />
          <div className={`loader ${isLoading ? 'active' : ''}`}></div>
        </SocketProvider>
      </UserContext.Provider>
    );
  }
}
