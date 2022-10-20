'use strict';

const express = require('express');
const morgan = require('morgan');
const QueueService = require('./services/queueService');

// init express
const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());

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

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
