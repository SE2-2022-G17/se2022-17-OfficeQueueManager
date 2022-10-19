const request = require('supertest');
const app = require("../server.js");
const dao = require("../dao");


describe('Test API for defining service types', () => {

    it('tests /api/services reset table', async () => {
        await dao.resetServiceTable();
        await dao.resetAutoIncrementedServiceId();
        const response = await request(app).get("/api/services");

        expect(response.body).toEqual([]);
        expect(response.statusCode).toBe(200);
    });



    it('tests /api/services get elements', async () => {
        await dao.resetServiceTable();
        await dao.resetAutoIncrementedServiceId()

        await dao.createService({ name: "service1", time: 1.0 });
        await dao.createService({ name: "service2", time: 0.5 });

        const response = await request(app).get("/api/services");
        expect(response.body).toEqual(expect.arrayContaining([{ id: 2, name: 'service2', time: 0.5 }]));
        expect(response.statusCode).toBe(200);

    });

    it('tests /api/services/:id get single element', async () => {
        await dao.resetServiceTable();
        await dao.resetAutoIncrementedServiceId();

        await dao.createService({ name: "service1", time: 1.0 });

        const response = await request(app).get("/api/services/1");
        expect(response.body).toEqual({ id: 1, name: "service1", time: 1.0 });
        expect(response.statusCode).toBe(200);
    });

    
    it('tests /api/services create single element', async () => {
        await dao.resetServiceTable();
        await dao.resetAutoIncrementedServiceId();

        const response = await request(app).post("/api/services").send({
            name: 'service1',
            time: 0.2
        });
        expect(response.statusCode).toBe(200);

        const service = await dao.getService(1);
        expect(service).toEqual({ id: 1, name: "service1", time: 0.2 });
    });



});

afterAll(() => {
    app.close();
});

