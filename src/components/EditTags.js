import React, { useState, useEffect } from 'react';
import { Button, Col, ListGroup, Row, Table } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './EditTags.module.css'; // create a new CSS module for this page

const EditTags = () => {
  const [images, setImages] = useState([]);
  const [inputs, setInputs] = useState([]);
  
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
  
        // Refresh the table by calling getAllImages.
        getAllImages();
      } else {
        console.error('Error:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
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
                                title={image.url}  // show full URL on hover
                                className={styles.tableLink}  // add this new style
                              >
                                {image.url}
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
                              <Button variant="outline-primary" onClick={() => handleSubmit(index)}>Submit</Button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EditTags;
