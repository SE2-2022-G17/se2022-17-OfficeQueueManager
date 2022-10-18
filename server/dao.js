'use strict';

const sqlite = require('sqlite3');
const dayjs = require("dayjs");

const db = new sqlite.Database('db.sqlite3', (err) => {
    if (err) console.error(err);
});

exports.reserve = (serviceId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO reservations (service_id, time) VALUES (?, ?)';
        db.run(sql, [serviceId, dayjs()], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
}

exports.getServiceById = (serviceId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM services WHERE id = ?';
        db.get(sql, [serviceId], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

exports.getServices = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM services';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}
