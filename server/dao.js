'use strict';

const sqlite = require('sqlite3');
const dayjs = require("dayjs");

const db = new sqlite.Database('db.sqlite3', (err) => {
    if (err) console.error(err);
});

exports.getServiceIdsByCounterId = (counterId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT serviceID AS serviceId FROM serviceCounters WHERE counterID = ?;';
        db.all(sql, [counterId], (err, serviceIds) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(serviceIds);
        });
    });
}


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

exports.getReservationsCountByService = (serviceId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS reservationsCount FROM reservations WHERE service_id = ?';
        db.get(sql, [serviceId], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
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
    });
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
        });
    });
}

//get all counters
exports.getAllCounters = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM counters";
        db.all(sql, (err, rows) => {
            if (err)
                reject(err);
            else {
                const counters = rows.map(row => ({ counterID: row.counterID, name: row.name }));
                resolve(counters);
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

exports.getReservationsByServiceIds = (serviceIds) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM reservations WHERE service_id IN (' + serviceIds.map(function () { return '?' }).join(',') + ') ORDER BY id';
        db.all(sql, serviceIds, (err, reservations) => {
            if (err) {
                reject(err);
            }
            resolve(reservations);
        });
    });
}

exports.getLowestTimeService = (serviceIds) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM services WHERE id IN (' + serviceIds.map(function () { return '?' }).join(',') + ') ORDER BY time LIMIT 0, 1';
        db.get(sql, serviceIds, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result.id);
        });
    });
}

exports.getServiceFirstReservation = (serviceId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM reservations WHERE service_id = ? ORDER BY id LIMIT 0, 1';
        db.get(sql, [serviceId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
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

exports.deleteReservation = (reservationId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM reservations WHERE id = ?';
        db.run(sql, [reservationId], (err) => {
            if (err) {
                reject(err);
            }
            resolve(1);
        });
    });
}

exports.getCounters = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM counters';
        db.all(sql, [], (err, counters) => {
            if (err) {
                reject(err);
            }
            resolve(counters);
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

exports.resetCountersTable = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM counters;';
        db.run(sql, [], (err) => {
            if (err) {
                reject(err);
                return;
            }
        });
        resolve();
    });
}

exports.resetServiceCounters = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM serviceCounters;';
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
