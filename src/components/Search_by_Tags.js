import React, { useState, useEffect } from 'react';
import {Button, Col, Container, Form, ListGroup, Table} from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './SearchImage.module.css';

const SearchImage = () => {
  const [tagFields, setTagFields] = useState([{ tag: '', count: '' }]);
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
      Auth.federatedSignIn();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
    const values  = [...tagFields];
    values.splice(index, 1);
    setTagFields(values);
  };

  return (
      <Container fluid className={styles.container}>
      <Col xs={3}>
        <ListGroup  className={styles.sidebar}>
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
        <h2  className={styles.title}>Search by Tag</h2>
      </Col>
      <Form onSubmit={handleSubmit} className={styles.formContainer}>
        {tagFields.map((field, index) => (
            <div key={`${field}-${index}`} className={styles.formRow}>
              <Form.Group as={Col}>
                <Form.Label>Tag</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter tag"
                    name="tag"
                    value={field.tag}
                    onChange={event => handleInputChange(index, event)}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Count</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter count"
                    name="count"
                    value={field.count}
                    onChange={event => handleInputChange(index, event)}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Remove Tag</Form.Label>
                <Button variant="danger" onClick={() => handleRemoveFields(index)}>Remove</Button>
              </Form.Group>
            </div>
        ))}
        <div className={styles.buttons}>
          <Button variant="primary" onClick={handleAddFields}>Add Tag</Button>
          <Button variant="success" type="submit">Submit</Button>
        </div>
      </Form>
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
                    </a></td>
                </tr>
              ))
              : 
              <tr>
                <td>No matching</td>
              </tr>
            )
          }
        </tbody>
      </Table>
      </Container>
  );
};

export default SearchImage;