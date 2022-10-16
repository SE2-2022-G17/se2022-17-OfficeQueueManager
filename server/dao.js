'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite3', (err) => {
    if (err) throw err;
});

exports.getIdFromUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM users WHERE username=?';
        db.get(sql, [user], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                reject({ error: 'User not found.' });
            } else {
                resolve(row.id);
            }
        });
    });
}

exports.getIdFromService = (service) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM services WHERE name=?';
        db.get(sql, [service], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                reject({ error: 'Service not found.' });
            } else {
                resolve(row.id);
            }
        });
    });
}

exports.createReservation = (reservation) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO reservations (userId, serviceId,requestTimeStamp) VALUES (?, ?, ?)';
        db.run(sql, [reservation.userId, reservation.serviceId,reservation.requestTimeStamp], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.getTeam = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM team';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const team = rows.map((member) => ({
                first: member.first,
                last: member.last,
                studentId: member.student_id
            }));
            resolve(team);
        });
    });
}