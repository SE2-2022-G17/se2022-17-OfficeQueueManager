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

app.get('/api/team', (req, res) => {
    dao.getTeam()
        .then((team) => { res.json(team); })
        .catch((error) => { res.status(500).json(error); });
});

app.get('/api/services', (req, res) => {
    dao.getAllServices()
        .then((services) => { res.json(services); })
        .catch((error) => { res.status(500).json(error); });
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

app.put('/api/services/:id', /* isAdmin, */ async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const time = req.body.time;

    try {
        await dao.modifyService({
            id: id,
            name: name,
            time: time
        });
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.delete('/api/services/:id', /* isAdmin, */ async (req, res) => {
    const id = req.params.id;
    try {
        await dao.deleteService(id);
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
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


// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;