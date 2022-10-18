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

//associate service to counter 
exports.addServiceToCounter = (serviceCounter) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO serviceCounter(idS, idC) values (?,?)";
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
        db.all(sql,[id], (err, rows) => {
            if (err)
                reject(err);
            else {
                const serviceCounter = rows.map(row => ({serviceID: row.serviceID, counterID: row.counterID}));
                resolve(serviceCounter);
            }
        });
    })
}

