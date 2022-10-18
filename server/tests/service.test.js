const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('server');
let agent = chai.request.agent(app);

describe("Services test", () => {

    it("get services test", async () => {
        await agent.get('/api/services')
            .then(function (res) {
                res.should.have.status(200);
            });
    });
});
