# Mindful-Zen

Mindful-Zen is a platform that combines productivity and mindfulness, designed to help users manage their goals and time intervals in an organized and mindful way. Whether you want to track personal progress or collaborate in a professional setting, Mindful-Zen provides intuitive tools to enhance focus and achieve your goals with ease and clarity.


## Technologies

**Mindful-Zen leverages the following technologies and libraries to provide a robust and scalable solution**:
**Backend**:
-	Node.js: For building the server-side application.
-	NestJS: For creating a modular and testable architecture.
-	TypeORM: As an Object-Relational Mapper (ORM) to handle database interactions.
-	JWT (jsonwebtoken): For authentication and token management.
-	class-validator: For validating user input and enforcing data integrity.
-	cookie-parser: To handle cookies for token management.
**Frontend**:
-	EJS: Embedded JavaScript templates for creating server-side rendered views.
-	Browserify: For bundling frontend scripts for modularity and reusability.
-	Axios: For making HTTP requests from the frontend to the backend API.


## Functionalities

**User Management**:
- Role-based access control using roles (user and admin) to restrict and manage access to resources.
- Token-based authentication using JWT for secured API calls.
- Support for token storage in cookies or Authorization headers.
**Intervals Management**:
- Define start and end dates for specific intervals linked to users.
- Cascade delete functionality to maintain referential integrity.
**Goals Management**:
- Assign goals to specific intervals for tracking progress.
- Ensure goals are connected to intervals and users.
**API Endpoints**:
- RESTful endpoints for CRUD users, intervals and goals.
- Token-based authentication for secured API calls.
**Testing**:
- Comprehensive test coverage for unit and integration tests.
- Use of environment-specific databases for development and testing.


## Requisites

**Before running the application ensure the following prerequisites are installed on your system**:
- Node.js.
- PostgreSQL: For the database.
- TypeScript: Compiles TypeScript code to JavaScript.
- Dependencies: Install required npm packages using npm install.


## Configuration

**To configure the application for development or production you need to set environment variables. Create a .env file in the root directory with the following variables**:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=yourDatabaseUser
DB_PASS=yourDatabasePassword
DB_NAME=mindful-zen-dev
DB_TEST_NAME=mindful-zen-test
JWT_SECRET=yourJWTSecretKey
```


## Installation

1.	**Clone the Repository**:
```bash
git clone https://github.com/lilianagorga/mindful-zen
```
2.	**Navigate to the Project Directory**:
```bash
cd mindful-zen
```
3.	**Install Dependencies**:
```bash
npm install
```
4.	**Build the Project**:
```bash
npm run build
```
5.	**Set up Databases**:
•	Ensure PostgreSQL is running on your system.
•	Create mindful-zen-dev and mindful-zen-test databases.
•	Generate migration:
```bash
npx typeorm migration:generate ./src/migrations/InitialMigration --dataSource ./dist/data-source.js
```
  •	Run migration:
```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run --dataSource ./dist/data-source.js
```
  •	Repeat the above steps with NODE_ENV=test to set up the testing environment:
```bash
NODE_ENV=test npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run --dataSource ./dist/data-source.js
```
6.	**Run the Application**:
```bash
npm run start:dev
```

## Docker

### Mindful-Zen can be easily containerized and deployed using Docker. The project includes a Dockerfile and docker-compose.yml to simplify the setup process.

**Steps to Use Docker**

1.	**Build and Run the Application**:
**Use the following command to build the Docker image and start the application**:
```bash
docker-compose up --build
```
2.	**Access the Application**:
**Once the containers are running, the application will be accessible at**:
```bash
http://localhost:3000
```
3.	**Database Configuration**:
**The docker-compose.yml sets up two PostgreSQL containers: one for development (db) and one for testing (db_test) using the environment variables defined in the .env file**.
4.	**Shutting Down the Containers**:
**To stop and remove all containers, networks and volumes run**:
```bash
docker-compose down
```
5.	**Rebuilding the Containers (Optional)**:
**If you make changes to the Dockerfile or docker-compose.yml, rebuild the containers with**:
```bash
docker-compose up --build
```


## API Endpoints

### Home:
- **GET /**: Returns the home page with the welcome message.
- **GET /register**: Displays the user registration form.
- **GET /login**: Displays the user login form.
- **GET /logout**: Logs out the current user, clears the JWT cookie, and redirects to the login page.
- **POST /register**: Registers a new user with the provided details.
- **POST /login**: Authenticates the user and provides a JWT token for secured access.

### Users:
- **GET /users**: Retrieves all users (admin-only).
- **GET /users/:id**: Retrieves details of a specific user by ID (accessible to admin and the user themselves).
- **PUT /users/:id**: Updates user details (accessible to admin and the user themselves).
- **PATCH /users/:id**: Partially updates user details (accessible to admin and the user themselves).
- **DELETE /users/:id**: Deletes a user by ID (accessible to admin and the user themselves).

### Intervals:
- **GET /intervals**: Retrieves all intervals with optional filtering based on query parameters:
  - **startDate**: Filters intervals starting after the provided date.
  - **endDate**: Filters intervals ending before the provided date.
  - **goalName**: Filters intervals associated with a specific goal name.
  - Admins can view all intervals while regular users can only view their own.
- **GET /intervals/:id**: Retrieves details of a specific interval by ID.
- **POST /intervals**: Creates a new interval linked to the current user.
- **PUT /intervals/:id**: Updates an interval by ID.
- **PATCH /intervals/:id**: Partially updates an interval by ID.
- **DELETE /intervals/:id**: Deletes an interval by ID.

### Goals:
- **GET /goals**: Retrieves all goals:
  - Admins can view all goals while regular users can view their own or public goals.
- **GET /goals/:id**: Retrieves details of a specific goal by ID.
- **POST /goals**: Creates a new goal associated with a specific interval.
- **PUT /goals/:id**: Updates a goal by ID.
- **PATCH /goals/:id**: Partially updates a goal by ID.
- **DELETE /goals/:id**: Deletes a goal by ID.

### Dashboard (Admin-Only):
- **GET /dashboard**: Displays a dashboard view with all users, intervals and goals.
- **POST /dashboard/intervals**: Creates a new interval linked to a specific user.
- **PUT /dashboard/intervals/:id**: Updates an interval by ID.
- **PATCH /dashboard/intervals/:id**: Partially updates an interval by ID.
- **DELETE /dashboard/intervals/:id**: Deletes an interval by ID.
- **POST /dashboard/goals**: Creates a new goal associated with a specific interval.
- **PUT /dashboard/goals/:id**: Updates a goal by ID.
- **DELETE /dashboard/goals/:id**: Deletes a goal by ID.

### Profile (Current User):
- **GET /profile**: Retrieves the profile view of the current user including their intervals and goals.
- **PUT /profile**: Updates the current user’s profile.
- **PATCH /profile**: Partially updates the current user’s profile.
- **DELETE /profile**: Deletes the current user’s profile.
- **POST /profile/intervals**: Creates a new interval linked to the current user.
- **PUT /profile/intervals/:id**: Updates an interval linked to the current user by ID.
- **PATCH /profile/intervals/:id**: Partially updates an interval linked to the current user by ID.
- **DELETE /profile/intervals/:id**: Deletes an interval linked to the current user by ID.
- **POST /profile/goals**: Creates a new goal linked to an interval owned by the current user.
- **PUT /profile/goals/:id**: Updates a goal owned by the current user by ID.
- **DELETE /profile/goals/:id**: Deletes a goal owned by the current user by ID.


## Testing

**Run tests using the following commands**:

1.	**Run Unit Tests**:
```bash
NODE_ENV=test npm run test
```
2.	**Run e2e Tests**:

  **Important**: Before running e2e tests for the first time ensure that the synchronize option is set to true in the database configuration (src/database.module.ts). This allows the database schema to be created automatically for testing. After the initial run reset the value to false to prevent unintended schema changes.
```bash
NODE_ENV=test npm run test:e2e
```


## Frontend Development

**To promote reusability and maintainability in the frontend specific functions were developed in TypeScript and bundled into a single JavaScript file using Browserify. Here’s the process followed**:
1.	**Write reusable frontend logic in a TypeScript file (e.g. src/frontend/utils.ts)**.
2.	**Compile the TypeScript file to JavaScript using**:
```bash
tsc src/utils/utils.ts --outDir dist/utils
```
3. **Bundle the compiled JavaScript file into a single file located in the public directory using Browserify**:
```bash
browserify dist/utils/utils.js -o public/js/bundle.js
```
4.	**Import the bundled JavaScript file into EJS views using**:
```bash
<script src="/js/bundle.js"></script>
```

## Live Deploy
* The application will be accessible at https://mindful-zen.lilianagorga.org

## Contributing

**Contributions are welcome! Here’s how you can contribute**:

1.  **Fork the repository**.
2.  **Create a new branch**:
```bash
git checkout -b feature/your-feature
```
3.  **Commit your changes**:
```bash
git commit -m "Add your feature"
```
4.	**Push your branch**:
```bash
git push origin feature/your-feature
```
5.	**Open a pull request**.



### License

**This project is licensed under the MIT License**.