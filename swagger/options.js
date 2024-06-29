const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Book Library API",
            version: "1.0",
            description:
                "This is a simple API for a book library. You can find the API documentation here.",
            license: {
                name: "MIT",
            },
            contact: {
                name: "Mufid",
                url: "https://mufid.com",
                email: "hi@mufidu.com",
            },
        },
        servers: [
            {
                url: "http://localhost:9000",
            },
            {
                url: "https://book-library-api.fly.dev",
            }
        ],
    },
    apis: ["./app/**/*.js", "./models/**/*.js"],
};

module.exports = options;
