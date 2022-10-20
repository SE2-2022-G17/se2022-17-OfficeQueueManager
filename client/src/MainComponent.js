import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';

function MainComponent(props) {

    const [counterId,setCounterId] = useState('');


  const callNext = async (event) => {
    event.preventDefault();

    let valid = true;
    if (counterId === '')
      valid = false;

    if (valid) {
      props.callNext(counterId);
      setCounterId("");
    } else {
      console.log('Invalid form');
    }
  } 

    return (
        <>
            <Row>
                <Col className='alignCenter'>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5">Current User:</Form.Label>
                        <Col sm="3">
                            <Form.Control value={props.resNumber} readOnly disabled />
                        </Col>
                    </Form.Group>
                </Col>
                <br />
                <br />
            </Row>
            <Row>
                <Col className='alignCenter'>
                    <Form.Group className="mb-3" controlId="counterId">
                        <Form.Control
                            type="text"
                            placeholder="Enter counter ID"
                            onChange={ev => setCounterId(ev.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Button variant="primary" type="submit" onClick={callNext}>
                        CALL NEXT USER
                    </Button>
                </Col>
            </Row>
        </>
    );

}

export { MainComponent }