import React from 'react';
import ReactDOM from 'react-dom';
import VacancyModal from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<VacancyModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
