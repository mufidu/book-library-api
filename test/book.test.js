const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const config = require("../config/environment-config");
config.loadEnvironmentVariables();

chai.use(chaiHttp);
chai.should();

describe("Book API", () => {
    describe("GET /api/public/books", () => {
        it("It should GET all the books", async () => {
            const res = await chai
                .request(app)
                .get("/api/public/books")
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.books.should.be.a("array");
        });
    });

    describe("GET /api/public/members", () => {
        it("It should GET all the members", async () => {
            const res = await chai
                .request(app)
                .get("/api/public/members")
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.members.should.be.a("array");
        });
    });
});
