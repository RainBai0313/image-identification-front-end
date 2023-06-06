import React, { useState, useEffect } from 'react';
import { Button, Col, ListGroup, Row, Table } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './SearchImageByImages.module.css';

const SearchImageByImage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [response, setResponse] = useState(null);
  
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
        const url = 'https://ivaylef3bi.execute-api.us-east-1.amazonaws.com/dev/search_by_image';
  
        const body = {
          body: base64Data,
          uuid: currentUser.signInUserSession.idToken.payload.sub,
          path: selectedImage.name.split('.').slice(0, -1).join('.')   // adding the filename to the request body
        };
  
        try {
          const response = await axios.post(url, body, config);
          console.log(response.data);
          setResponse(response.data.body);
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
              <Button className={styles.buttonSize} variant="outline-primary" href="/upload">Upload Image</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/search_by_tag">Search Image By Tag</Button>
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
          <h2 className={styles.title}>Search Image By Image</h2>
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
              {uploading ? 'Searching....' : 'Upload'}
            </Button>
          </div>
        </Col>
        <Col>
            <Table bordered hover>
                <tbody>
                {
                    response && 
                    (Array.isArray(response) && response.length > 0 ? 
                    response.map((imageUrl, index) => (
                        <tr key={index}>
                            <td>
                                <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                                    {imageUrl}
                                </a>
                            </td>
                        </tr>
                    ))
                    : 
                    <tr>
                        <td>No matching images found</td>
                    </tr>
                    )
                }
                </tbody>
            </Table>
        </Col>
      </Row>
    </div>
  );
};

export default SearchImageByImage;
