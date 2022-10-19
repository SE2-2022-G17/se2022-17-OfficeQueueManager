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

//associate service to counter 
exports.addServiceToCounter = (serviceCounter) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO serviceCounters(serviceID, counterID) values (?,?)";
        console.log(serviceCounter);
        db.run(sql, [serviceCounter.serviceID, serviceCounter.counterID], function (err) {
            if (err) {
                reject(err);
                return;
            } else resolve(this.id);
        })
    });
}


//get service by counterID
exports.getServiceByCounterID = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM serviceCounters WHERE counterID = ?";
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else {
                const serviceCounter = rows.map(row => ({ serviceID: row.serviceID, counterID: row.counterID }));
                resolve(serviceCounter);
            }
        });
    })
}

//add counter 
exports.addCounter = (counter) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO counters(counterID, name) values (?,?)";
        db.run(sql, [counter.counterID, counter.name], function (err) {
            if (err) {
                reject(err);
                return;
            } else resolve(this.id);
        })
    });
}

//get all counters
exports.getAllCounters= () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM counters";
        db.all(sql, (err, rows) => {
            if (err)
                reject(err);
            else {
                const counters = rows.map(row => ({ counterID: row.counterID, name: row.name}));
                resolve(counters);
            }
        });
    })
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

exports.resetServiceTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM services;';
        db.run(sql, [], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        resolve();
    });
}

exports.resetAutoIncrementedServiceId = () => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM sqlite_sequence WHERE name='services';`
        db.run(sql, [], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        resolve();
    });
}
