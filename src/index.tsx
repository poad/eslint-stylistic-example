/* @refresh reload */
import App from './App.jsx';
import { render } from 'solid-js/web';

import './index.css';

const root = document.getElementById('root');

if (root) {
  render(() => <App />, root);
}