# Recovery Center Management System

A comprehensive web application for managing recovery and treatment centers, including user reviews, program information, and center details.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/VedangP57/recovery.git
cd recovery
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required dependencies including:
- express
- mysql2
- bcryptjs
- cors
- dotenv
- jsonwebtoken

### 3. Database Setup

1. Login to MySQL:
```bash
mysql -u root -p
```

2. Create the database and required tables by running the SQL script:
```bash
mysql -u root -p < database.sql
```

Alternatively, you can copy and paste the contents of database.sql into your MySQL console.

### 4. Environment Configuration

Create a `.env` file in the root directory with the following configurations:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=recovery

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

Replace the placeholder values with your actual database credentials and preferred configurations.

### 5. Start the Application

```bash
npm start
```

The server will start running on http://localhost:3000 (or your configured PORT).

## Project Structure

- `server.js` - Main application entry point
- `config/` - Configuration files
  - `database.js` - Database connection setup
- `controllers/` - Application controllers
  - `centerController.js` - Treatment center related operations
  - `userController.js` - User management operations
- `database.sql` - Database schema and tables
- HTML Files:
  - `index.html` - Home page
  - `center-detail.html` - Center details page
  - `addiction.html` - Addiction information
  - `mental-health.html` - Mental health resources
  - And more...

## Database Schema

The application uses the following main tables:
1. `treatment_centers` - Stores center information
2. `treatment_programs` - Programs offered by centers
3. `users` - User information
4. `reviews` - User reviews for centers
5. `insurance_providers` - Available insurance providers
6. `inquiries` - User inquiries about centers
7. `center_images` - Images associated with centers

## Features

- User authentication and authorization
- Treatment center listing and details
- Review and rating system
- Insurance provider integration
- Program management
- User inquiry system
- Image management for centers

## API Routes

### Centers
- GET `/api/centers` - Get all centers
- GET `/api/centers/:id` - Get specific center
- POST `/api/centers` - Add new center (Admin only)
- POST `/api/centers/:id/reviews` - Add review for a center

### Users
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - User login
- GET `/api/users/profile` - Get user profile

## Security

The application implements:
- Password hashing using bcryptjs
- JWT-based authentication
- Protected routes for admin operations
- Input validation and sanitization

## Support

For any issues or questions, please open an issue in the GitHub repository or contact the development team.

## License

ISC License - See LICENSE file for details