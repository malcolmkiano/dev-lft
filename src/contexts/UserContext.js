import React from 'react';

const UserContext = React.createContext({
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
  onAuth: () => null,
  onLogOut: () => null,
  onProfileChange: () => null,
  startLoading: () => null,
  stopLoading: () => null
});

export default UserContext;
