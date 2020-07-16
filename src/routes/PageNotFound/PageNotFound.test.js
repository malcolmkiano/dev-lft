import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import PageNotFound from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <PageNotFound />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
