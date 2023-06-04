import React, { useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { Auth } from 'aws-amplify';

const Home = () => {
  useEffect(() => {
    checkUser(); // Check if the user is signed in
  }, []);

  const checkUser = async () => {
    try {
      await Auth.currentSession();
    } catch (error) {
      // Redirect to the Cognito Hosted UI sign-in page
      window.location.href = 'https://fit5225group6.auth.us-east-1.amazoncognito.com/login?client_id=7e8ho0ofisu83pbmcm4ivsudot&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmaster.d1bqd04ay5ovd9.amplifyapp.com%2F';
    }
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
