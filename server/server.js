'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const dao = require('./dao');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userDao = require('./userDao');
const QueueService = require('./services/queueService');
const http = require('http');
const { Server } = require('socket.io');
/*(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
})*/


passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });
            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user);
        }).catch(err => {
            done(err, null);
        });
});

// init express
const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions)); //per l'esame

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.status(401).json({ error: 'not authenticated' });
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == 'ADMIN')
        return next();
    return res.status(403).json({ error: 'unauthorized' });
};

app.use(session({
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



/*** APIs ***/
app.get('/api/reservations', (req, res) => {

    QueueService.getQueue()
        .then((result) => {
            res.status(200).json(result);
        });
});

app.put('/api/next-ticket', (req, res) => {

    const counterId = req.body.counterId;

    QueueService.getNextQueue(counterId)
        .then((result) => {
            res.status(200).json(result);
        });
});

app.get('/api/services/:id', (req, res) => {
    const id = req.params.id;
    dao.getService(id)
        .then((service) => { res.json(service); })
        .catch((error) => { res.status(500).json(error); });
});

app.post('/api/services', /* isAdmin, */ async (req, res) => {
    const name = req.body.name;
    const time = req.body.time;

    try {
        await dao.createService({
            name: name,
            time: time
        });
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/api/services', (req, res) => {
    dao.getServices()
        .then(services => res.json(services))
        .catch(error => res.status(500).json(error));
});


app.post('/api/reserve', (req, res) => {
    const serviceId = req.body.serviceId;

    dao.getServiceById(serviceId)
        .then((service) => {
            dao.reserve(serviceId)
                .then(reservationId => {
                    res.status(201).json({
                        reservationNumber: reservationId
                    });
                })
                .catch((error) => { res.status(500).json(error); });
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


/*** Users APIs ***/

// POST /sessions
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json(info);
        }
        req.login(user, (err) => {
            if (err)
                return next(err);
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /sessions/current
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.end();
    });
});

// GET /sessions/current
// check wheter the user is Logged in or not
app.get('/api/sessions/current', isLoggedIn, (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });
});


/** APIs **/

//ADD /api/serviceCounter
app.post('/api/serviceCounter', [],
    async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }

    const serviceCounter = {
        serviceID: request.body.serviceID,
        counterID: request.body.counterID,
    };

    try {
        await dao.addServiceToCounter(serviceCounter);
        response.status(201).end();
    }
    catch (err) {
        response.status(503).json({ error: `Database error!` });
    }
});


//GETSERVICESBYCOUNTERID /api/serviceCounter/:id
app.get('/api/serviceCounter/:id', async (request, response) => {
    try {
        const result = await dao.getServiceByCounterID(request.params.id);

        if (result.error)
            response.status(404).json(result);
        else
            response.json(result);
    } catch (err) {
        response.status(500).end();
    }
});


//ADD /api/counter
app.post('/api/counter', [],
    async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }

    const counter = {
        counterID: request.body.counterID,
        name: request.body.name,
    };

    try {
        await dao.addCounter(counter);
        response.status(201).end();
    }
    catch (err) {
        response.status(503).json({ error: `Database error!` });
    }
});

//GETALLCOUNTERS /api/counters
app.get('/api/counters', async (request, response) => {
    try {
        const result = await dao.getAllCounters();

        if (result.error)
            response.status(404).json(result);
        else
            response.json(result);
    } catch (err) {
        response.status(500).end();
    }
});



const server=http.createServer(app);
const io = new Server(server);
let interval;
let count=1;
const counters = [{id:1,name:"counter1"},{id:2,name:"counter2"}]; //ARRAY OF COUNTER
const idToQueue = {}; //ASSOCIATIVE ARRAY BETWEEN COUNTER.ID AND THE USER NUMBER QUEUE
counters.forEach(counter => {
    //queue = db.getQueueByCounter()
    idToQueue[counter.id] = [count,count+1];
    count=count+2;
})

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => counters.forEach((counter)=>socket.emit(counter.name,idToQueue[counter.id][0])),1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

// activate the server
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = server;
