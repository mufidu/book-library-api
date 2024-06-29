# Book Library API

This project is a RESTful API for a book library. It allows members to borrow and return books.

## Features

### CI/CD

-   **Testing:** Unit and integration tests are run on GitHub Actions every time a commit is pushed.
-   **Continuous Deployment:** Every successful push to the main branch triggers a deployment to fly.io.

### User Authentication

-   **Members Authentication:** Members can register and login to borrow books.

### Book Borrowing

-   **Borrow Books:** Members can borrow books from the library.
	-   **Borrowing Conditions:** Members can borrow up to 2 books at a time.
	-   **Book Availability:** Books that are already borrowed by other members are not available for borrowing.
-   **Return Books:** Members can return books to the library.
	-   **Return Conditions:** Members can only return books that they have borrowed.
	-   **Penalty:** Members returning books after 7 days are penalized and cannot borrow books for 3 days.

### Check Books and Members

-   **Check Books:** Members can check all existing books and their quantities.
-   **Check Members:** Members can check all existing members and the number of books they have borrowed.

### Security

-   **Validation and Error Handling:** All API endpoints have proper validation and error handling.
-   **Sensitive Information:** Sensitive information is securely encrypted.

### Logging and Monitoring

-   **Logging:** Important events and errors are logged with Morgan.
-   **Monitoring:** Basic monitoring for API performance is implemented using Prometheus.

### Testing

-   **Unit Tests:** Important API endpoints (books and members) have unit tests.
-   **Integration Testing:** Integration testing ensures components work together seamlessly.

## Database Schema

![Database Schema](https://raw.githubusercontent.com/mufidu/jobhun-devops-test/main/Screenshot%202024-06-29%20at%2021.51.36.jpg)

## Documentation

The API documentation is available at [Postman Documenter](https://documenter.getpostman.com/view/33823495/2sA3duGDBf), and also via Swagger UI at `http://localhost:9000/api-docs` when running the server locally.

## Getting Started

### Tech Stack

-   Node.js and npm for server-side code.
-   PostgreSQL for database.
-   Postman for API testing.
-   GitHub Actions for CI/CD.
-   Prometheus for monitoring.
-   Docker for containerization.
-   Swagger UI for API documentation.
-   fly.io for deployment.

### Setup

1. Clone the repository:

```bash
git clone https://github.com/mufidu/book-library-api.git
cd book-library-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up the environment variables:

```bash
cp deployment/.env.example deployment/.env
```

4. Set up the database:

```bash
NODE_ENV=development npx sequelize-cli db:migrate
```

5. Start the server:

```bash
npm run dev
```

6. The server will be running at `http://localhost:9000`.

## Deployment

The API is deployed on fly.io. The live version is available at [https://book-library-api.fly.dev](https://book-library-api.fly.dev).
