const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('server');
let agent = chai.request.agent(app);


describe("Reservation test", () => {

    it("get reservations test", async () => {
        await agent.get('/api/reservations')
            .then(function (res) {
                expect(res.status).toBe(200);
            });
    });

    it("get next reservation test", async () => {
        await agent.put('/api/next-ticket')
            .send({
                counterId: 1
            })
            .then(function (res) {
                expect(res.status).toBe(200);
            });
    });
});


afterAll(() => {
    app.close();
});
