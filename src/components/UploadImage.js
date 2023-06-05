import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './UploadImage.module.css';

const UploadImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
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
        uuid: currentUser.signInUserSession.idToken.payload.email,
        path: selectedImage.name   // adding the filename to the request body
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
  );
};

export default UploadImage;
