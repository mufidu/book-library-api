const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const config = require("../config/environment-config");
config.loadEnvironmentVariables();

chai.use(chaiHttp);
chai.should();

let token;

before(async () => {
    try {
        const res = await chai
            .request(app)
            .post("/api/customer/auth/login")
            .send({
                username: process.env.TEST_USERNAME_CUSTOMER,
                password: process.env.TEST_PASSWORD_CUSTOMER,
            });
        console.log("Login response customer", res.body);
        token = res.body.data.token;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
});

describe("Cart API", () => {
    describe("POST /api/customer/cart", () => {
        it("It should POST a book to cart", async () => {
            const book = {
                bookId: 5,
                quantity: 2,
            };
            const res = await chai
                .request(app)
                .post("/api/customer/cart")
                .set("Authorization", `Bearer ${token}`)
                .send(book);
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.should.have.property("id");
            res.body.data.should.have.property("CustomerId");
            res.body.data.should.have.property("totalPrice");
            res.body.data.should.have.property("books");
            res.body.data.books.should.be.a("array");
            res.body.data.books.length.should.be.eq(1);
            res.body.data.books[0].should.have.property("id").eq(5);
            res.body.data.books[0].should.have.property("CartBook");
            res.body.data.books[0].CartBook.should.have
                .property("quantity")
                .eq(2);
        });
    });

    describe("GET /api/customer/cart", () => {
        it("It should GET cart", async () => {
            const res = await chai
                .request(app)
                .get("/api/customer/cart")
                .set("Authorization", `Bearer ${token}`);
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.should.have.property("id");
            res.body.data.should.have.property("CustomerId");
            res.body.data.should.have.property("totalPrice");
            res.body.data.should.have.property("books");
            res.body.data.books.should.be.a("array");
            res.body.data.books.length.should.be.eq(1);
            res.body.data.books[0].should.have.property("id").eq(5);
            res.body.data.books[0].should.have.property("CartBook");
            res.body.data.books[0].CartBook.should.have
                .property("quantity")
                .eq(2);
        });
    });

    describe("POST /api/customer/order/checkout", () => {
        it("It should POST checkout cart", async () => {
            const res = await chai
                .request(app)
                .post("/api/customer/order/checkout")
                .set("Authorization", `Bearer ${token}`);
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.should.have.property("id");
            res.body.data.should.have.property("CustomerId");
            res.body.data.should.have.property("invoiceNumber");
            res.body.data.should.have.property("amount");
            res.body.data.should.have.property("status").eq("Pending");
            res.body.data.should.have.property("items");
        });
    });
});
