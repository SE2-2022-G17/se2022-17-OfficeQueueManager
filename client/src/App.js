import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import API from './API';


function App() {
  const [team, setTeam] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
    API.getTeam()
      .then(team => {
        setTeam(team);
      })
      .catch(err => console.log(err));
  }, []);

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

  return (
    <div className="App">
      <header className="App-header">

        {
          loggedIn === false ?
            <LoginForm doLogIn={doLogIn} />
            : <MainContent doLogOut={doLogOut} user={user} />
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
      <Button onClick={props.doLogOut}>Logout</Button>
    </Col>
  );
}

function NewTaskForm() {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  const createNewService = async (event) => {
    event.preventDefault();
    const service = {
      name: name,
      time: parseFloat(time)
    };

    let valid = true;
    if (name === '' || isNaN(parseFloat(time)) || parseFloat(time) === 0.0)
      valid = false;

    if (valid) {
      await API.createService(service);
    } else {
      console.log('Invalid form');
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
              onChange={ev => setName(ev.target.value)}
            />
          </Form.Group>
        </Col>

        <Col className='alignCenter'>
          <Form.Group className="mb-3" controlId="formServiceTime">
            <Form.Control
              type="text"
              placeholder="Enter service time"
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
    </Form>
  )
}
export default App;
