import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';

import './index.css';
import App from './App';
import { AlertProvider } from './context/AlertProvider';
import Layout from './components/layouts/Layout';
import { Buffer } from 'buffer';

window.Buffer = window.Buffer || Buffer;

if (module.hot) {
  module.hot.accept();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AlertProvider>
        <Layout>
          <App />
        </Layout>
      </AlertProvider>
    </Provider>
  </React.StrictMode>
);
