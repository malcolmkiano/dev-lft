import React from 'react';
import ReactDOM from 'react-dom';
import ProjectForm from '.';

it('renders without crashing', () => {
  const stub = () => null;
  const div = document.createElement('div');
  ReactDOM.render(<ProjectForm onCreate={stub} onCancel={stub} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
