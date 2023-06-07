import React, { useState, useEffect } from 'react';
import {Button, Col, ListGroup, Row, Modal} from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './UploadImage.module.css';

const UploadImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleUpload = async () => {
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];

      const currentUser = await Auth.currentAuthenticatedUser();
      const token = currentUser.signInUserSession.idToken.jwtToken;

      const config = {
        headers: {
          Authorization: token,
        },
      };

      // Replace 'https://your-api-gateway-url' with your actual API Gateway URL
      const url = 'https://ivaylef3bi.execute-api.us-east-1.amazonaws.com/dev/upload';

      const body = {
        body: base64Data,
        uuid: currentUser.signInUserSession.idToken.payload.sub,
        path: selectedImage.name.split('.').slice(0, -1).join('.')   // adding the filename to the request body
      };

      try {
        const response = await axios.post(url, body, config);
        console.log(response.data);
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Error uploading image: ', error);
      }

      setUploading(false);
    };
    

    reader.readAsDataURL(selectedImage);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className={styles.uploadImageContainer}>
      <Row>
        <Col xs={3}>
          <ListGroup className={styles.sidebar}>
            {/* List of actions */}
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
              <Button className={styles.buttonSize} variant="outline-primary" href="/">Return Home</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="outline-danger" onClick={handleSignOut}>Sign Out</Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col className={styles.bar}>
          <h2 className={styles.title}>Upload Image</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={styles.inputContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.inputFile}
            />
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className={styles.uploadButton}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </Col>
      </Row>
      <Modal show={showSuccessModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Image Uploaded</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Image has been uploaded successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UploadImage;
