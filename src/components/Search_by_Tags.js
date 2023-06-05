import React, { useState, useEffect } from 'react';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './SearchImage.module.css';

const SearchImage = () => {
  const [tagFields, setTagFields] = useState([{ tag: '', count: '' }]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    checkUser();
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
    <div className={styles.searchImageContainer}>
      <Form onSubmit={handleSubmit}>
        {tagFields.map((field, index) => (
          <Row key={`${field}-${index}`}>
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
              <Button variant="danger" onClick={() => handleRemoveFields(index)}>Remove</Button>
            </Form.Group>
          </Row>
        ))}
        <Button variant="primary" onClick={handleAddFields}>Add Tag</Button>
        <Button variant="success" type="submit" className={styles.submitButton}>Submit</Button>
      </Form>
      {
        response && 
        (Array.isArray(response) ? 
          response.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index}`} />
          )) 
          : 
          <p>{response}</p>
        )
      }
    </div>
  );
};

export default SearchImage;
