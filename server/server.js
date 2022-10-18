'use strict';

const express = require('express');
const morgan = require('morgan');
const dao = require('./dao');

// init express
const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());

/*** APIs ***/
app.get('/api/services', (req, res) => {
    dao.getServices()
        .then(services => res.json(services))
        .catch(error => res.status(500).json(error));
});

app.post('/api/reserve',  (req, res) => {
    const serviceId = req.body.serviceId;

    dao.getServiceById(serviceId)
        .then((service) => {
            dao.reserve(serviceId)
                .then(reservationId => {
                    res.status(201).json({
                        reservationNumber: service.tag + '' + reservationId
                    });
                })
                .catch((error) => { res.status(500).json(error); });
        })
        .catch(error => {
            res.status(500).json(error);
        });

});

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;
