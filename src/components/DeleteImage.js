import React, { useState, useEffect } from 'react';
import { Button, Col, ListGroup, Modal, Row, Table } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './DeleteImage.module.css'; // create a new CSS module for this page

const DeleteImage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  useEffect(() => {
    checkUser();
    getAllImages();
  }, []);
  
  const checkUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('User: ', user);
    } catch (error) {
      console.log('Error: ', error);
      Auth.federatedSignIn();
    }
  };

  const getAllImages = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      const token = currentUser.signInUserSession.idToken.jwtToken;

      const config = {
        headers: {
          Authorization: token,
        },
      };

      const body = {
        uuid: currentUser.signInUserSession.idToken.payload.sub,
      };

      const url = 'https://ivaylef3bi.execute-api.us-east-1.amazonaws.com/dev/view_images';

      const response = await axios.post(url, body, config);
      const images = response.data.body.map(imageString => {
        const [url, tags] = imageString.split('::');

        return { url, tags };
      });
      setImages(images);
    } catch (error) {
      console.error('Error getting all images: ', error);
    }

  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');

    if (confirmDelete) {
      setLoading(true);

      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const token = currentUser.signInUserSession.idToken.jwtToken;

        const config = {
          headers: {
            Authorization: token,
          },
        };

        const body = {
          url: images[index].url,
          uuid: currentUser.signInUserSession.idToken.payload.sub,
        };

        const response = await axios.post('https://ivaylef3bi.execute-api.us-east-1.amazonaws.com/dev/delete_image', body, config);

        if (response.status === 200) {
          console.log('Success:', response.data);
          setShowSuccessModal(true);

          // Refresh the table by calling getAllImages.
          getAllImages();
        } else {
          console.error('Error:', response);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className={styles.container}>
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
          <h2 className={styles.title}>Delete Image</h2>
        </Col>
      </Row>
      <Row className={styles.content}>
        <Col>
          <div className={styles.tableResponsive}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Image URL</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {images.map((image, index) => (
                  <tr key={index}>
                    <td>
                    <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={image.url}
                        className={styles.tableLink}
                        >
                        <img src={image.url} alt={`Image ${index}`} className={styles.image} />
                    </a>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleDelete(index)}
                        disabled={loading} // Disable the button when loading
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Modal show={showSuccessModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Image Deleted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Image has been deleted successfully.</p>
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

export default DeleteImage;
