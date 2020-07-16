import React from 'react';
import ReactDOM from 'react-dom';
import ChatMessageForm from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ChatMessageForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
