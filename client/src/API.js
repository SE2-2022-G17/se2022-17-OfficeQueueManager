const url  = 'http://localhost:3000';

async function getTeam() {
    const response = await fetch(url + '/api/team');
    return response.json();
}

async function setServiceForUser(user,service){
    const response = await fetch(url + '/api/setServiceForUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user: user,service: service}),
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

async function getUserInfo() {
    const response = await fetch(url + '/api/sessions/current');
    const userInfo = await response.json();

    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;
    }
}


const API = { getTeam, logIn, logOut, getUserInfo, setServiceForUser };

export default API;