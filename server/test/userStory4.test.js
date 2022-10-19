const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('server');
let agent = chai.request.agent(app);

describe("Counter test", () => {
    it("create new counter test", async () => {
        await agent.post('/api/counter')
            .send({
                counterID : '2',
                name : 'counterTest'
            })
            .then(function (res) {
                expect(res.status).toBe(201);
            });
    });
});

describe("ServiceCounter test", () => {
    it("Associate a counter to a service test", async () => {
        await agent.post('/api/serviceCounter')
            .send({
                serviceID : '1',
                counterID : '1'
            })
            .then(function (res) {
                expect(res.status).toBe(201);
            });
    });
    
});

afterAll(() => {
    app.close();
});