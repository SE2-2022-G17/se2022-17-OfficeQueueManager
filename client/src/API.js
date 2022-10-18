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

    if (response.ok) return services.map(service => new Service(service.id, service.name, service.description, service.tag, service.time));
    else throw services;
}

const API = { getServices, reserve };

export default API;
