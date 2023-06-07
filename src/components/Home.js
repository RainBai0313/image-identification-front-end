import React, { useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import styles from './Home.module.css';

const Home = () => {
  useEffect(() => {
    checkUser();
  }, []);

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm('Are you sure you want to sign out?');
    if (confirmSignOut) {
      try {
        await Auth.signOut();
      } catch (error) {
        console.log('Error signing out: ', error);
      }
    }
  };

  const checkUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('User: ', user);
    } catch (error) {
      console.log('Error: ', error);
      // Redirect to home if not logged in
      Auth.federatedSignIn();
    }
  };
  

  return (
    <Container fluid className={styles.container}>
      <Row>
        <Col xs={3}>
          <ListGroup  className={styles.sidebar}>
            {/* List of actions */}
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/upload">Upload Image</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/search_by_tag">Search Image By Tag</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/search_by_images">Search Image By Image</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/edit_tags">Edit Tags</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/delete_image">Delete Image</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="outline-danger" onClick={handleSignOut}>Sign Out</Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col className={styles.bar}>
          <h2  className={styles.title}>Home Page</h2>
        </Col>
        <Col className={styles.welcome}>
          <h2>CloudSnap: A Serverless Image Storage System with Tagging</h2>
          <p>Our system is a cloud-based, serverless system that enables customers to upload their images to public cloud storage. The system has five main functions.

By clicking on upload image, users can upload an image for the machine to perform object detection. Our system identifies the object categories in the image (people, tables, chairs, etc.) and tags the image with these identified categories. In addition, the user can SEARCH image by tag, SEARCH image by image, and also edit the tags of the image or delete the image. Users can select the features they need through the dashboard on the left.</p>

          <p>
          Privacy Warning: The image upload for object detection would be stored in our system. Please make sure not upload images with private information or images that you may not willing to be stored in our system.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
