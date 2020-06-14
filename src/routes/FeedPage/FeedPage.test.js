import React from 'react';
import ReactDOM from 'react-dom';
import FeedPage from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <FeedPage />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
