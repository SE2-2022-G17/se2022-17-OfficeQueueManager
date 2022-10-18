const url = 'http://localhost:3000';

async function getTeam() {
    const response = await fetch(url + '/api/team');
    return response.json();
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

async function getUserInfo() {
    const response = await fetch(url + '/api/sessions/current');
    const userInfo = await response.json();

    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;
    }
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


const API = { getTeam, logIn, logOut, getUserInfo, addServiceToCounter, addCounter, getAllCounters };

export default API;