import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, ListGroup, Table, Row } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './SearchImage.module.css';

const SearchImage = () => {
  const [tagFields, setTagFields] = useState([{ tag: '', count: '' }]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

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
      Auth.federatedSignIn();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    const currentUser = await Auth.currentAuthenticatedUser();
    const uuid = currentUser.signInUserSession.idToken.payload.sub;
    const token = currentUser.signInUserSession.idToken.jwtToken;
    const tags = tagFields;

    const config = {
      headers: {
        Authorization: token,
      },
    };

    const body = {
      uuid,
      tags,
    };

    try {
      const response = await axios.post('https://ivaylef3bi.execute-api.us-east-1.amazonaws.com/dev/searche_by_tags', body, config);
      const imageUrls = response.data.body;
      setResponse(imageUrls);
    } catch (error) {
      console.error('Error submitting tags: ', error);
    }
    setLoading(false); // Set loading state to false
  };

  const handleInputChange = (index, event) => {
    const values = [...tagFields];
    if (event.target.name === "tag") {
      values[index].tag = event.target.value;
    } else {
      values[index].count = parseInt(event.target.value);
    }
    setTagFields(values);
  };

  const handleAddFields = () => {
    setTagFields([...tagFields, { tag: '', count: '' }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...tagFields];
    values.splice(index, 1);
    setTagFields(values);
  };

  return (
    <Container fluid className={styles.container}>
      <Row>
        <Col xs={3}>
          <ListGroup className={styles.sidebar}>
            {/* List of actions */}
            <ListGroup.Item>
              <Button className={styles.buttonSize} variant="outline-primary" href="/upload">Upload Image</Button>
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
          <h2 className={styles.title}>Search by Tag</h2>
        </Col>
      </Row>
      <Row className={styles.content}>
        <Form onSubmit={handleSubmit} className={styles.formContainer}>
          {tagFields.map((field, index) => (
            <div key={`${field}-${index}`} className={styles.formRow}>
              <Form.Group as={Col} className={styles.formGroup}>
                <Form.Label>Tag</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter tag"
                  name="tag"
                  value={field.tag}
                  onChange={event => handleInputChange(index, event)}
                />
              </Form.Group>
              <Form.Group as={Col} className={styles.formGroup}>
                <Form.Label>Count</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter count"
                  name="count"
                  value={field.count}
                  onChange={event => handleInputChange(index, event)}
                />
                
              </Form.Group>
              <Button
                  variant="danger"
                  className={styles.removeButton}
                  onClick={() => handleRemoveFields(index)}
                >
                  Remove
              </Button>
            </div>
          ))}
          <div className={styles.buttons}>
            <Button variant="primary" onClick={handleAddFields}>Add Tag</Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Submit'}
            </Button>
          </div>
        </Form>
        <p></p>
        <Table bordered hover>
          <tbody>
              {response && Array.isArray(response) && response.length > 0 ? (
                response.map((imageUrl, index) => (
                  <tr key={index}>
                    <td>
                      <a href={imageUrl} target="_blank" rel="noopener noreferrer" title={imageUrl} className={styles.tableLink}>
                        <img src={imageUrl} alt={`Image ${index}`} className={styles.image} />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No matching images found</td>
                </tr>
              )}
            </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default SearchImage;
