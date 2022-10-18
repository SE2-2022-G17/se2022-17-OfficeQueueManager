const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('server');
let agent = chai.request.agent(app);

describe("Reservation test", () => {

    it("create new reserve test", async () => {
        await agent.post('/api/reserve')
            .send({
                serviceId: 1
            })
            .then(function (res) {
                //res.should.have.status(200);
                expect(res.status).toBe(201);
            });
    });
});
