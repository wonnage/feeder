import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import secret from './SECRET.js';

ReactDOM.render(
  <App secret={secret} />,
  document.getElementById('root')
);
