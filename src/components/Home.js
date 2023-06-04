import React, { useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { Auth } from 'aws-amplify';

const Home = () => {
  useEffect(() => {
    checkUser(); // Check if the user is signed in
  }, []);

  const checkUser = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const idToken = urlParams.get('id_token');
      const accessToken = urlParams.get('access_token');
      
      if (idToken && accessToken) {
        // Get the user ID from the ID token
        const decodedIdToken = parseJwt(idToken);
        const userId = decodedIdToken.sub;
        console.log('User ID:', userId);
        
        // Do something with the user ID
        
        // Remove the tokens from the URL
        window.location.hash = '';
      } else {
        // Redirect to the Cognito Hosted UI sign-in page
        window.location.href = 'https://fit5225group6.auth.us-east-1.amazoncognito.com/login?client_id=7e8ho0ofisu83pbmcm4ivsudot&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmaster.d1bqd04ay5ovd9.amplifyapp.com%2F';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    return JSON.parse(jsonPayload);
  };

  return (
    <Container fluid>
      <Row>
        <Col xs={3}>
          <ListGroup>
            {/* List of actions */}
            <ListGroup.Item action>
              <Button variant="outline-primary" href="/upload">Upload Image</Button>
            </ListGroup.Item>
            <ListGroup.Item action>
              <Button variant="outline-primary" href="/search-tag">Search Image By Tag</Button>
            </ListGroup.Item>
            <ListGroup.Item action>
              <Button variant="outline-primary" href="/search-image">Search Image By Image</Button>
            </ListGroup.Item>
            <ListGroup.Item action>
              <Button variant="outline-primary" href="/edit-tags">Edit Tags</Button>
            </ListGroup.Item>
            <ListGroup.Item action>
              <Button variant="outline-primary" href="/delete-image">Delete Image</Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
          <h2>Welcome to the Dashboard</h2>
          <p>Select an action from the left to get started.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
