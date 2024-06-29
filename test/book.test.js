const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const config = require("../config/environment-config");
config.loadEnvironmentVariables();

chai.use(chaiHttp);
chai.should();

let token, bookId;

before(async () => {
    try {
        const res = await chai.request(app).post("/api/admin/auth/login").send({
            username: process.env.TEST_USERNAME_ADMIN,
            password: process.env.TEST_PASSWORD_ADMIN,
        });
        console.log("Login response admin", res.body);
        token = res.body.data.token;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
});

describe("Book API", () => {
    describe("POST /api/admin/book", () => {
        it("It should not POST a book without title", async () => {
            const book = {
                price: 1000,
                genre: "Fantasy",
                cover: "cover.jpg",
                author: "J.K. Rowling",
                year: 2000,
                quantity: 10,
            };
            const res = await chai
                .request(app)
                .post("/api/admin/book")
                .set("Authorization", `Bearer ${token}`)
                .send(book);
            res.should.have.status(400);
        });
        it("It should POST a book", async () => {
            const book = {
                title: "Harry Potter and the Philosophers Stone",
                price: 1000,
                genre: "Fantasy",
                cover: "https://placehold.co/100x180?text=Harry%20Potter",
                author: "J.K. Rowling",
                year: 1997,
                quantity: 10,
            };
            const res = await chai
                .request(app)
                .post("/api/admin/book")
                .set("Authorization", `Bearer ${token}`)
                .send(book);
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.should.have.property("id");
            res.body.data.should.have
                .property("title")
                .eq("Harry Potter and the Philosophers Stone");

            // Save the bookId for other tests
            bookId = res.body.data.id;
        });
    });

    describe("GET /api/admin/book", () => {
        it("It should GET all the books", async () => {
            const res = await chai
                .request(app)
                .get("/api/admin/book")
                .set("Authorization", `Bearer ${token}`);
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.should.be.a("array");
        });
    });

    describe("GET /api/admin/book/:id", () => {
        it("It should GET a book by ID", async () => {
            const res = await chai
                .request(app)
                .get(`/api/admin/book/${bookId}`)
                .set("Authorization", `Bearer ${token}`);
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.should.have.property("id").eq(bookId);
        });
        it("It should not GET a book by ID", async () => {
            const bookId = 9999;
            const res = await chai
                .request(app)
                .get(`/api/admin/book/${bookId}`)
                .set("Authorization", `Bearer ${token}`);
            res.should.have.status(404);
        });
    });

    describe("PUT /api/admin/book/:id", () => {
        it("It should UPDATE a book", async () => {
            const book = {
                title: "Harry Potter and the Chamber of Secrets",
                price: 1000,
                genre: "Fantasy",
                cover: "https://placehold.co/100x180?text=Harry%20Potter",
                author: "J.K. Rowling",
                year: 1998,
                quantity: 10,
            };
            const res = await chai
                .request(app)
                .put(`/api/admin/book/${bookId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(book);
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.should.have
                .property("title")
                .eq("Harry Potter and the Chamber of Secrets");
        });
        it("It should not UPDATE a book", async () => {
            const bookId = 9999;
            const book = {
                title: "Harry Potter",
                price: 1000,
                genre: "Fantasy",
                cover: "cover.jpg",
                author: "J.K. Rowling",
                year: 2000,
                quantity: 10,
            };
            const res = await chai
                .request(app)
                .put(`/api/admin/book/${bookId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(book);
            res.should.have.status(404);
        });
    });

    describe("DELETE /api/admin/book/:id", () => {
        it("It should DELETE a book", async () => {
            const res = await chai
                .request(app)
                .delete(`/api/admin/book/${bookId}`)
                .set("Authorization", `Bearer ${token}`);
            res.should.have.status(200);
        });
        it("It should not DELETE a book", async () => {
            const bookId = 9999;
            const res = await chai
                .request(app)
                .delete(`/api/admin/book/${bookId}`)
                .set("Authorization", `Bearer ${token}`);
            res.should.have.status(404);
        });
    });
});
