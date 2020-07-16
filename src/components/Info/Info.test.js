import React from 'react';
import ReactDOM from 'react-dom';
import Info from '.';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <Info />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
