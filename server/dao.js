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