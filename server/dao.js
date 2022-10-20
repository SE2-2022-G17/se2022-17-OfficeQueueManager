'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('db.sqlite3', (err) => {
    if (err) throw err;
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

exports.getReservationsByServiceIds = (serviceIds) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM reservations WHERE service_id IN (' + serviceIds.map(function(){ return '?' }).join(',') + ') ORDER BY id';
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
        const sql = 'SELECT id FROM services WHERE id IN (' + serviceIds.map(function(){ return '?' }).join(',') + ') ORDER BY time LIMIT 0, 1';
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
