'use strict';

const dayjs = require("dayjs");

const express = require('express');
const morgan = require('morgan');
const dao = require('./dao');
const session = require('express-session');
const userDao = require('./userDao');


// init express
const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());

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

app.get('/api/services', (req, res) => {
    dao.getServices()
        .then(services => res.json(services))
        .catch(error => res.status(500).json(error));
});

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});