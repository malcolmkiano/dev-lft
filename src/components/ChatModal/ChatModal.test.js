import React from 'react';
import ReactDOM from 'react-dom';
import ChatModal from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ChatModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
