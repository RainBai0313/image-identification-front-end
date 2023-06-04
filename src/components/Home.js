import React, { useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { Auth } from 'aws-amplify';

const Home = () => {
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // getCurrentUser() will return the current authenticated user
      const user = await Auth.currentAuthenticatedUser();
      console.log('User: ', user);
    } catch (error) {
      console.log('Error: ', error);
      // signIn() will redirect to the Cognito Hosted UI for login
      Auth.federatedSignIn();
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
