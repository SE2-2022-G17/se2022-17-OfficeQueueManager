'use strict';

const express = require('express');
const morgan = require('morgan');
const dao = require('./dao');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userDao = require('./userDao');

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

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.status(401).json({ error: 'not authenticated' });
};

app.use(session({
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


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

app.get('/api/team', (req, res) => {
    dao.getTeam()
        .then((team) => { res.json(team); })
        .catch((error) => { res.status(500).json(error); });
});


//ADD /api/serviceCounter
app.post('/api/serviceCounter', isLoggedIn, [],
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
app.get('/api/serviceCounter/:id', isLoggedIn, async (request, response) => {
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
app.post('/api/counter', isLoggedIn, [],
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
        await dao.addSCounter(counter);
        response.status(201).end();
    }
    catch (err) {
        response.status(503).json({ error: `Database error!` });
    }
});

//GETALLCOUNTERS /api/counters
app.get('/api/counters', isLoggedIn, async (request, response) => {
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



// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});