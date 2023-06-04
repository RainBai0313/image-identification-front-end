import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_9tVQ8XxK6',
      userPoolWebClientId: '7e8ho0ofisu83pbmcm4ivsudot',
      authenticationFlowType: 'USER_SRP_AUTH',
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
