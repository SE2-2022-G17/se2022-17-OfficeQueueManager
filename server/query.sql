drop table if exists reservations;
drop table if exists services;

create table services (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    time REAL NOT NULL
);

CREATE TABLE reservations (
    "id" INTEGER PRIMARY KEY,
    "service_id" INTEGER NOT NULL,
    "time" TEXT,
     FOREIGN KEY("service_id") REFERENCES services(id)
);



INSERT INTO services (name, time)
    VALUES ('test', 1.0);
