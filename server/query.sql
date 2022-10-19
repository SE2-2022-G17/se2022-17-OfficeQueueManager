drop table if exists reservations;
drop table if exists counters_services;
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
                          "id" INTEGER PRIMARY KEY,
                          "service_id" INTEGER NOT NULL,
                          FOREIGN KEY("service_id") REFERENCES services(id)
);

CREATE TABLE counters_services (
                          "counter_id" INTEGER NOT NULL,
                          "service_id" INTEGER NOT NULL,
                          FOREIGN KEY("service_id") REFERENCES services(id)
                          FOREIGN KEY("counter_id") REFERENCES counters(id)
);

CREATE TABLE reservations (
                              "id" INTEGER PRIMARY KEY,
                              "service_id" INTEGER NOT NULL,
                              "time" TEXT,
                              FOREIGN KEY("service_id") REFERENCES services(id)
);

INSERT INTO services (name, description, tag, time)
VALUES ('test', 'test, test, test, test', 'test', 120),
       ('test2', 'test, test, test, test', 'test2', 120);

INSERT INTO counters (service_id)
VALUES (1);

INSERT INTO counters_services (counter_id, service_id)
VALUES (1, 1), (1, 2);

INSERT INTO reservations (service_id, time)
VALUES (2, '1'), (1, '1');
