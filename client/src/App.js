import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import API from './API';
import {Card} from "react-bootstrap";
import {TextCenter} from "react-bootstrap-icons";


function App() {

  const [services, setServices] = useState([
    // {
    //   id: 1,
    //   title: 'GG'
    // },
    // {
    //   id: 1,
    //   title: 'GG'
    // },
    // {
    //   id: 1,
    //   title: 'GG'
    // },
    // {
    //   id: 1,
    //   title: 'GG'
    // }
  ]);

  useEffect(() => {
    API.getServices().then((result) => {
      // setServices(result.json)
      // console.log(result.json());
    }) ;
  }, []);

  return (
      <main className={'d-flex align-items-center justify-content-center'} style={ { 'height': '100vh' } }>
        <Row>
          {
            services.length > 0 ?
                services.map(service => <ServiceCard key={service.id} service={service} />) :
                <NoServices/>
          }
        </Row>
      </main>
  );
}

function ServiceCard(props) {
  return (
      <Col md={4}>
        <Card role={'button'}>
          <Card.Body className={'text-center'}>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
  );
}

function NoServices() {
  return(
      <div style={{
             'font-size': '24px'
           }}>No Services</div>
  );
}

export default App;
