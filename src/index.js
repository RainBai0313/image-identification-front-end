import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Amplify, Auth} from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: 'us-east-1',
        userPoolId: 'us-east-1_9tVQ8XxK6',
        userPoolWebClientId: '7e8ho0ofisu83pbmcm4ivsudot',
        oauth: {
            domain: 'fit5225group6.auth.us-east-1.amazoncognito.com',
            scope: ['phone', 'email', 'openid',  'profile', 'aws.cognito.signin.user.admin'],
            redirectSignIn: 'https://fit5225group6.auth.us-east-1.amazoncognito.com/oauth2/idpresponse',
            redirectSignOut: 'https://fit5225group6.auth.us-east-1.amazoncognito.com/signout',
            responseType: 'code',   // or 'token', note that REFRESH token will only be generated when the responseType is code
            provider: 'Google',
            client_id: '1075313455165-np290cahbbjibp7b3eeo8bofnp26mp9e.apps.googleusercontent.com',
        }
    }
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
