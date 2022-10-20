import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import API from './API';
import { Card } from "react-bootstrap";
import UserNotification from './modules/UserNotification';

import { MainComponent } from './MainComponent';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [reservationNumber, setReservationNumber] = useState("");
  const [services, setServices] = useState([]);
  const [reserveBack, setReserveBack] = useState(false);
  const [reserveInfo, setReserveInfo] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        console.log(err.error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    API.getServices().then((result) => {
      setServices(result);
    });
  }, []);

  function reserve(serviceId) {
    API.reserve(serviceId)
      .then((response) => {
        console.log(response);
        setReserveBack(true);
        setReserveInfo(response.reservationNumber);
      }).catch((error) => {
        console.log(error);
      });
  }

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      console.log({ msg: err, type: 'danger' });
    }
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
  };

  const callNext = async (counterId) => {
    API.reservations(counterId)
      .then((reservations) => {
        if (reservations === undefined)
          console.log("counter inesistente");
        else
          if (reservations[0].reservationNumber === undefined) {
            console.log("Coda vuota");
            setReservationNumber(undefined);
          }
          else {
            setReservationNumber(reservations[0].reservationNumber);
          }
      });
  }

  return (
    <div className="App">
      <header className="App-header">

        {
          loggedIn === false ?
            <>
              <LoginForm doLogIn={doLogIn} />
              {
                reserveBack ?
                  <Alert variant='success'>{reserveInfo}</Alert> :
                  <></>
              }
              <ServicesMain services={services} reserve={reserve} />
              <UserNotification />
            </>
            : <MainContent doLogOut={doLogOut} user={user} callNext={callNext} resNumber={reservationNumber} />

        }
      </header>
    </div>
  );
}


function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    let valid = true;
    if (username === '' || password === '' || password.length < 4)
      valid = false;
    if (valid) {
      props.doLogIn(credentials);
    } else {
      //TODO: show message
    }
  }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          onChange={ev => setUsername(ev.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={ev => setPassword(ev.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  );
}


function MainContent(props) {
  return (
    <Col>
      <p>Welcome, {props.user.username}!</p>
      <p>Role: {props.user.role}</p>
      {
        props.user.role === 'ADMIN' ?
          <NewTaskForm />
          : undefined
      }
      {
        props.user.role === 'OFFICER' ?
          <MainComponent callNext={props.callNext} resNumber={props.resNumber} />
          : undefined
      }
      <Button onClick={props.doLogOut}>Logout</Button>
    </Col>
  );
}

function NewTaskForm() {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [newServiceSent, setNewServiceSent] = useState(false);
  const [newServiceResp, setNewServiceResp] = useState(false);

  const [counterName, setCounterName] = useState('');
  const [counterId, setCounterId] = useState('');
  const [newCounterSent, setNewCounterSent] = useState(false);
  const [newCounterResp, setNewCounterResp] = useState(false);

  const [serviceId, setServiceId] = useState('');  // This two states are used to associate a counter to a service
  const [counterIdForService, setCounterIdForService] = useState('');
  const [counterServiceSent, setCounterServiceSent] = useState(false);
  const [counterServiceResp, setCounterServiceResp] = useState(false);

  const createNewService = async (event) => {
    event.preventDefault();
    const service = {
      name: name,
      time: parseFloat(time)
    };

    let valid = true;
    if (name === '' || isNaN(parseFloat(time)) || parseFloat(time) === 0.0)
      valid = false;
    setNewServiceSent(true);
    if (valid) {
      const result = await API.createService(service);
      if (result.ok) {
        setNewServiceResp(true);
        setName('');
        setTime('');
      }
      else {
        setNewServiceResp(false);
      }
    } else {
      console.log('Invalid form');
      setNewServiceResp(false);
    }
  }

  const createNewCounter = async (event) => {
    event.preventDefault();
    const counter = {
      counterID: counterId,
      name: counterName,
    };
    setNewCounterSent(true);
    let valid = true;
    if (counterName === '' || counterId === '')
      valid = false;

    if (valid) {
      API.addCounter(counter)
        .then(() => {
          setNewCounterResp(true);
          setCounterId('');
          setCounterName('');
        })
        .catch(err => {
          setNewCounterResp(false);
        })
    } else {
      console.log('Invalid form');
      setNewCounterResp(false);
    }
  }

  const associateCounterToService = async (event) => {
    event.preventDefault();

    let valid = true;
    if (serviceId === '' || counterIdForService === '' || isNaN(counterIdForService))
      valid = false;
    setCounterServiceSent(true);
    if (valid) {
      const serviceCounter = {
        serviceID: serviceId,
        counterID: counterIdForService
      };
      API.addServiceToCounter(serviceCounter)
        .then(() => {
          setCounterServiceResp(true);
          setCounterIdForService('');
          setServiceId('');
        })
        .catch(err => {
          setCounterServiceResp(false);
        });
    } else {
      console.log('Invalid form');
      setCounterServiceResp(false);
    }
  }

  return (
    <Form>
      <Row>

        <Col className='alignCenter'>
          <Form.Group className="mb-3" controlId="formServiceName">
            <Form.Control
              type="text"
              placeholder="Enter service name"
              value={name}
              onChange={ev => setName(ev.target.value)}
            />
          </Form.Group>
        </Col>

        <Col className='alignCenter'>
          <Form.Group className="mb-3" controlId="formServiceTime">
            <Form.Control
              type="text"
              placeholder="Enter service time"
              value={time}
              onChange={ev => setTime(ev.target.value)}
            />
          </Form.Group>
        </Col>

        <Col>
          <Button variant="primary" type="submit" onClick={createNewService}>
            Create
          </Button>
        </Col>
      </Row>

      <Row>
        {
          newServiceSent ?
            newServiceResp ?
              <Alert variant='success'>Service correctly created.</Alert> :
              <Alert variant='danger'>Error.</Alert>
            : <></>
        }
      </Row>

      <Row>

        <Col className='alignCenter'>
          <Form.Group className="mb-3" controlId="formCounterName">
            <Form.Control
              type="text"
              placeholder="Enter counter ID"
              value={counterId}
              onChange={ev => setCounterId(ev.target.value)}
            />
          </Form.Group>
        </Col>

        <Col className='alignCenter'>
          <Form.Group className="mb-3" controlId="formCounterId">
            <Form.Control
              type="text"
              placeholder="Enter counter name"
              value={counterName}
              onChange={ev => setCounterName(ev.target.value)}
            />
          </Form.Group>
        </Col>

        <Col>
          <Button variant="primary" type="submit" onClick={createNewCounter}>
            Add Counter
          </Button>
        </Col>
      </Row>

      <Row>
        {
          newCounterSent ?
            newCounterResp ?
              <Alert variant='success'>Counter correctly created.</Alert> :
              <Alert variant='danger'>Error.</Alert>
            : <></>
        }
      </Row>

      <Row>

        <Col className='alignCenter'>
          <Form.Group className="mb-3" controlId="formServiceNameForCounter">
            <Form.Control
              type="text"
              placeholder="Enter service Id"
              value={serviceId}
              onChange={ev => setServiceId(ev.target.value)}
            />
          </Form.Group>
        </Col>

        <Col className='alignCenter'>
          <Form.Group className="mb-3" controlId="formCounterIdForService">
            <Form.Control
              type="text"
              placeholder="Enter counter id"
              value={counterIdForService}
              onChange={ev => setCounterIdForService(ev.target.value)}
            />
          </Form.Group>
        </Col>

        <Col>
          <Button variant="primary" type="submit" onClick={associateCounterToService}>
            Associate
          </Button>
        </Col>

      </Row>
      <Row>
        {
          counterServiceSent ?
            counterServiceResp ?
              <Alert variant='success'>Counter correctly associated to a service.</Alert> :
              <Alert variant='danger'>Error.</Alert>
            : <></>
        }
      </Row>
    </Form>
  )
}

function ServicesMain(props) {
  return (
    <main style={{ 'height': '100vh' }}>
      <Row className={'h-100'}>
        <Col md={12} className={'my-auto'}>
          <Row className={'justify-content-center'}>
            {
              props.services.length > 0 ?
                props.services.map(service => <ServiceCard key={service.id} service={service} reserve={props.reserve} />) :
                <NoServices />
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
      <Card role={'button'} onClick={() => props.reserve(props.service.id)}>
        <Card.Body className={'text-center'}>
          <Card.Title>{props.service.name}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
}

function NoServices() {
  return (
    <div className={'text-center'} style={{
      fontSize: '24px'
    }}>No Services</div>
  );
}


export default App;
