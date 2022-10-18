const url  = 'http://localhost:3000';

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

async function getServices(){
    return await fetch(url + '/api/services', {
    }).catch(function (error) {
        console.log('Failed to store data on server: ', error);
    });
}

const API = { setServiceForUser, getServices };

export default API;