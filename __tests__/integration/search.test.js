const request = require("supertest");
const app = require("../../app");

it("should search for 2 bedrooms", async () => {
    const response = await request(app).post("/search").send({
        checkin: "2023-04-05",
        checkout: "2023-04-09",
    });

    expect(response.status).toBe(200);
});
