const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const dao = require("../dao");

const app = require('server');
let agent = chai.request.agent(app);

describe("Counter test", () => {
    it("create new counter test", async () => {
        await dao.resetCountersTable();
        const res = await agent.post('/api/counter')
            .send({
                counterID : '2',
                name : 'counterTest'
            })
        expect(res.status).toBe(201);
    });
});

describe("ServiceCounter test", () => {
    it("Associate a counter to a service test", async () => {
        await dao.resetServiceCounters();
        const res = await agent.post('/api/serviceCounter')
            .send({
                serviceID : '1',
                counterID : '1'
            });
        expect(res.status).toBe(201);
    });
    
});

afterAll(() => {
    app.close();
});