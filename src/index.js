import { BrowserRouter } from 'react-router-dom';
import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = createRoot(container);
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

root.render(app);

serviceWorker.unregister();
