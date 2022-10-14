'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite3', (err) => {
    if (err) throw err;
});

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

exports.getAllServices = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM services';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const services = rows.map((service) => ({
                id: service.id,
                name: service.name,
                time: service.time
            }));
            resolve(services);
        });
    });
}

exports.getService = (serviceId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM services WHERE id=?';
        db.get(sql, [serviceId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                reject({ error: 'Service not found.' });
            } else {
                const service = {
                    id: row.id,
                    name: row.name,
                    time: row.time
                };
                resolve(service);
            }
        });
    });
}

exports.createService = (service) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO services (name, time) VALUES (?, ?)';
        db.run(sql, [service.name, service.time], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.deleteService = (serviceId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM services WHERE id=?';
        db.run(sql, [serviceId], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}