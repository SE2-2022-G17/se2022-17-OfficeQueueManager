import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import API from './API';
import {Card} from "react-bootstrap";


function App() {

  const [services, setServices] = useState([]);

  function reserve(serviceId) {
      API.reserve(serviceId)
          .then((response) => {
              console.log(response);
          }).catch((error) => {
          console.log(error);
      });
  }

  useEffect(() => {
    API.getServices().then((result) => {
      setServices(result);
    });
  }, []);

  return (
      <main style={ { 'height': '100vh' } }>
        <Row className={'h-100'}>
            <Col md={12} className={'my-auto'}>
                <Row className={'justify-content-center'}>
                      {
                        services.length > 0 ?
                            services.map(service => <ServiceCard key={service.id} service={service} reserve={reserve} />) :
                            <NoServices/>
                      }
                </Row>
            </Col>
        </Row>
      </main>
  );
}

function ServiceCard(props) {
  return (
      <Col md={4}>
        <Card role={'button'} onClick={ () => props.reserve( props.service.id ) }>
          <Card.Body className={'text-center'}>
            <Card.Title>{ props.service.name }</Card.Title>
            <Card.Text>{ props.service.description }</Card.Text>
          </Card.Body>
        </Card>
      </Col>
  );
}

function NoServices() {
  return(
      <div className={'text-center'} style={{
             fontSize: '24px'
           }}>No Services</div>
  );
}

export default App;
