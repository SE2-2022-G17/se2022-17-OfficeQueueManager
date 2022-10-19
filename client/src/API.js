import Service from "./classes/Service";

const url  = 'http://localhost:3000';

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

const API = { logIn, logOut, getUserInfo, createService, getServices, reserve};

export default API;
