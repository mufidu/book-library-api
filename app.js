const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const errorHandlerMiddleware = require("./app/middlewares/handle-error");
const notFoundMiddleware = require("./app/middlewares/not-found");
const promMiddleware = require("express-prometheus-middleware");

const app = express();

app.use(logger("dev"));
app.use(
    promMiddleware({
        metricsPath: "/metrics",
        collectDefaultMetrics: true,
        requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        msg: "Welcome to Book Library API",
        data: {},
    });
});

const memberRoutes = {
    auth: require("./app/api/member/auth/router"),
    book: require("./app/api/member/book/router"),
};

const publicRoutes = {
    book: require("./app/api/public/book/router"),
    member: require("./app/api/public/member/router"),
};

Object.values(memberRoutes).forEach((route) => app.use("/api", route));
Object.values(publicRoutes).forEach((route) => app.use("/api", route));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
