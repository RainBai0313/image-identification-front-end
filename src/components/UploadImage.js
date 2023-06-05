import React, { useState, useEffect } from 'react';
import {Button, Col, ListGroup, Row} from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './UploadImage.module.css';

const UploadImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

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
    reader.onloadend = () => {
      setSelectedImageUrl(reader.result);
    };
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
      } catch (error) {
        console.error('Error uploading image: ', error);
      }

      setUploading(false);
    };

    reader.readAsDataURL(selectedImage);
  };

  return (
    <div className={styles.uploadImageContainer}>
      <Row>
        <Col xs={3}>
          <ListGroup className={styles.sidebar}>
            {/* List of actions */}
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/search-tag">Search Image By Tag</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/search-image">Search Image By Image</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/edit-tags">Edit Tags</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/delete-image">Delete Image</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/">Return Home</Button>
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
        <Col>
          <div className={styles.imagePreviewContainer}>
            {selectedImageUrl && (
              <img src={selectedImageUrl} alt="Selected" className={styles.imagePreview} />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UploadImage;
