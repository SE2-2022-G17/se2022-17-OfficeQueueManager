import Service from "./classes/Service";

const url = 'http://localhost:3001';


async function reserve(serviceId){
    const response = await fetch(url + '/api/reserve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            serviceId: serviceId
        }),
    }).catch(function (error) {
        console.log('Failed to store data on server: ', error);
    });
    return await response.json();
}

async function getServices(){
    const response = await fetch(url + '/api/services', {
    }).catch(function (error) {
        console.log('Failed to store data on server: ', error);
    });

    const services = await response.json();

    if (response.ok) return services.map(service => new Service(service.id, service.name, service.time));
    else throw services;
}

async function getUserInfo() {
    const response = await fetch(url + '/api/sessions/current');
    const userInfo = await response.json();

    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;
    }
}

async function createService(service) {
    const response = await fetch(url + '/api/services', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
    }).catch(function (error) {
        console.log('Failed to store data on server: ', error);
    });
    return response;
}


async function logIn(credentials) {
    let response = await fetch(url + '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch(url + '/api/sessions/current', { method: 'DELETE' });
}

//associate service to counter
async function addServiceToCounter(serviceCounter) {
    return new Promise((resolve, reject) => {
        fetch(url + '/api/serviceCounter', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serviceID: serviceCounter.serviceID, counterID: serviceCounter.counterID }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((message) => { reject(message); })
                    .catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot communicate with server." }) });
    });
}

async function reservations(counterId) {
    // call: GET /api/courses
    const response = await fetch(url + '/api/reservations');
    const res = await response.json();
    if (response.ok) {

        //res.filter(elem => elem.contain(counterId));
        let count = "Counter" + counterId;
        return res[`${count}`];
    } else {
        throw res;  // an object with the error coming from the server
    }
}

async function setNextTicket(ticket) {
    const response = await fetch(url + '/api/next-ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
    }).catch(function (error) {
        console.log('Failed to store data on server: ', error);
    });
    return response;
}

//add counter
async function addCounter(counter) {
    return new Promise((resolve, reject) => {
        fetch(url + '/api/counter', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({counterID: counter.counterID, name: counter.name}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((message) => { reject(message); })
                    .catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot communicate with server." }) });
    });
}

//GET all counters
async function getAllCounters() {
    // call: GET /api/counters
    const response = await fetch(url + '/api/counters', { credentials: 'include' });
    const countersJson = await response.json();
    if (response.ok) {
      return countersJson.map((row) => ({ serviceID: row.serviceID, counterID: row.counterID }));
    } else {
      throw countersJson;  // an object with the error coming from the server
    }
  }

const API = { logIn, logOut, getUserInfo, addServiceToCounter, addCounter, getAllCounters ,createService, getServices, reserve, reservations, setNextTicket};

export default API;
