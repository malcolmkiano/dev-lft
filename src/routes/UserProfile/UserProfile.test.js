import React from 'react';
import ReactDOM from 'react-dom';
import UserProfile from '.';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    match: {
      params: {
        username: 'test-user-1'
      }
    }
  };
  ReactDOM.render(
    <BrowserRouter>
      <UserProfile {...props} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
