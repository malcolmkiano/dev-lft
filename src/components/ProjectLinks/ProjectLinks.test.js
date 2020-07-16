import React from 'react';
import ReactDOM from 'react-dom';
import ProjectLinks from '.';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <ProjectLinks />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
