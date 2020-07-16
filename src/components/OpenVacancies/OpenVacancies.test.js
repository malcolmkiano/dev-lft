import React from 'react';
import ReactDOM from 'react-dom';
import OpenVacancies from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OpenVacancies />, div);
  ReactDOM.unmountComponentAtNode(div);
});
