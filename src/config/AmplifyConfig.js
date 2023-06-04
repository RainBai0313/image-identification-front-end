import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: 'us-east-1',
        userPoolId: 'us-east-1_9tVQ8XxK6',
        userPoolWebClientId: '7e8ho0ofisu83pbmcm4ivsudot',
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    },
});
