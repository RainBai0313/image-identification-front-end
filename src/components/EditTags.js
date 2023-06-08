import React, { useState, useEffect } from 'react';
import { Button, Col, ListGroup, Modal, Row, Table } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './EditTags.module.css'; // create a new CSS module for this page

const EditTags = () => {
  const [images, setImages] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  useEffect(() => {
    checkUser();
    getAllImages();
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

      const defaultInputs = images.map(() => ({ option: 'add', tag: '', count: 1 }));
      setInputs(defaultInputs);
    } catch (error) {
      console.error('Error getting all images: ', error);
    }

  };

  const handleInputChange = (index, field) => event => {
    const newInputs = [...inputs];
    newInputs[index][field] = event.target.value;
    setInputs(newInputs);
  };

  const handleSubmit = async (index) => {
    const confirmDelete = window.confirm('Are you sure you want to edit the tag of this image?');

    if (confirmDelete) {
      setLoading(true);
      // Convert the option to a number.
      const type = inputs[index].option === 'add' ? 1 : 0;
    
      // Construct the tags object.
      const tags = [{
        tag: inputs[index].tag,
        count: parseInt(inputs[index].count, 10),
      }];
    
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const token = currentUser.signInUserSession.idToken.jwtToken;
    
        const config = {
          headers: {
            Authorization: token,
          },
        };

        // Construct the request body.
        const body = {
          url: images[index].url,
          type,
          tags,
          uuid: currentUser.signInUserSession.idToken.payload.sub,
        };
    
        const response = await axios.post('https://ivaylef3bi.execute-api.us-east-1.amazonaws.com/dev/edit_tags', body, config);
    
        if (response.status === 200) {
          console.log('Success:', response.data);
          setShowSuccessModal(true);
          setLoading(false);
    
          // Refresh the table by calling getAllImages.
          getAllImages();
        } else {
          console.error('Error:', response);
        }
      } catch (error) {
        console.error('Error:', error);
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
              <Button className={styles.buttonSize} variant="outline-primary" href="/upload">Upload Image</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/search_by_tag">Search Image By Tag</Button>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/search_by_images">Search Image By Image</Button>
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
          <h2 className={styles.title}>Edit Tags of Images</h2>
        </Col>
      </Row>
      <Row className={styles.content}>
        <Col>
          <div className={styles.tableResponsive}>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Image URL</th>
                        <th>Tags</th>
                        <th>Option</th>
                        <th>Tag</th>
                        <th>Count</th>
                        <th>Submit</th>
                    </tr>
                </thead>
                <tbody>
                {
                    images.map((image, index) => (
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
                            <td>{image.tags}</td>
                            <td>
                            <select value={inputs[index].option} onChange={handleInputChange(index, 'option')}>
                              <option value="add">Add</option>
                              <option value="remove">Remove</option>
                            </select>
                          </td>
                            <td>
                              <input type="text" value={inputs[index].tag} onChange={handleInputChange(index, 'tag')} />
                            </td>
                            <td>
                              <input type="number" value={inputs[index].count} onChange={handleInputChange(index, 'count')} />
                            </td>
                            <td>
                            <Button
                              variant="outline-primary"
                              onClick={() => handleSubmit(index)}
                              disabled={loading} // Disable the button when loading
                            >
                              {loading ? 'Updating....' : 'Update'}
                            </Button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Modal show={showSuccessModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tags Updated</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The tags of this image has been updated successfully</p>
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

export default EditTags;
