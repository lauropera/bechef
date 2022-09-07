import React from 'react';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import LoginProvider from './contexts/LoginProvider';
import RecipesProvider from './contexts/RecipesProvider';

ReactDOM.render(
  <HashRouter>
    <LoginProvider>
      <RecipesProvider>
        <App />
      </RecipesProvider>
    </LoginProvider>
  </HashRouter>,
  document.getElementById('root'),
);

serviceWorker.unregister();
