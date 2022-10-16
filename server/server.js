'use strict';

const dayjs = require("dayjs");

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

/*** APIs ***/
app.get('/api/team', (req, res) => {
    dao.getTeam()
        .then((team) => { res.json(team); })
        .catch((error) => { res.status(500).json(error); });
});

app.post('/api/setServiceForUser', async (req, res) => {
    dao.getIdFromUser(req.body.user)
    .then(userId => {
        dao.getIdFromService(req.body.service)
        .then(serviceId => {
            const service = {
                userId: userId,
                serviceId: serviceId,
                requestTimeStamp: dayjs().format("YYYY-MM-DD HH:mm:ss")
            };
            console.log(userId);
            console.log(serviceId);
            dao.createReservation(service).then(()=>res.end)
            .catch((error) => { res.status(500).json(error); })
        })
        .catch((error) => { res.status(500).json(error); })
    })
    .catch((error) => { res.status(500).json(error); })
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