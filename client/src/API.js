const url = 'http://localhost:3001';

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

const API = { getTeam, logIn, logOut, getUserInfo, reservations, setNextTicket };

export default API;
