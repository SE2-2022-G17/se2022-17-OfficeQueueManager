drop table if exists reservations;
drop table if exists serviceCounters;
drop table if exists counters;
drop table if exists services;

create table services (
                          id INTEGER PRIMARY KEY,
                          name TEXT NOT NULL,
                          description TEXT NOT NULL,
                          tag TEXT NOT NULL,
                          time INTEGER
);

CREATE TABLE counters (
                          "counterID" INTEGER PRIMARY KEY,
                          "name" TEXT UNIQUE
);

CREATE TABLE serviceCounters (
                          "counterID" INTEGER NOT NULL,
                          "serviceID" INTEGER NOT NULL,
                          FOREIGN KEY("serviceID") REFERENCES services(id)
                          FOREIGN KEY("counterID") REFERENCES counters(id)
);

CREATE TABLE reservations (
                              "id" INTEGER PRIMARY KEY,
                              "service_id" INTEGER NOT NULL,
                              "time" TEXT,
                              FOREIGN KEY("service_id") REFERENCES services(id)
);

INSERT INTO services (name, description, tag, time)
VALUES ('test', 'test, test, test, test', 'test', 120),
       ('test2', 'test, test, test, test', 'test2', 120),
       ('test3', 'test, test, test, test', 'test3', 140);

INSERT INTO counters (name)
VALUES ("Counter1"), ("Counter2");

INSERT INTO serviceCounters (counterID, serviceID)
VALUES (1, 1), (1, 2), (2, 3);

INSERT INTO reservations (service_id, time)
VALUES (2, '1'), (1, '1'), (3, '1'), (3, '1');
