drop table if exists reservations;
drop table if exists services;

create table services (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    tag TEXT NOT NULL,
    time INTEGER
);

CREATE TABLE reservations (
    "id" INTEGER PRIMARY KEY,
    "service_id" INTEGER NOT NULL,
    "time" TEXT,
     FOREIGN KEY("service_id") REFERENCES services(id)
);


INSERT INTO services (name, description, tag, time)
    VALUES ('test', 'test, test, test, test', 'test', 120);
