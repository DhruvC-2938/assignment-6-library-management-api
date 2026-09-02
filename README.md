# 📚 Library Management System REST API

A complete, production-ready RESTful API for a Library Management System built with **Node.js**, **Express.js**, **JSON Web Tokens (JWT)**, and **Google Cloud Firebase Firestore**.

---

Live Deploy Link : [https://assignment-6-library-management-api-sdk2.onrender.com](https://assignment-6-library-management-api-sdk2.onrender.com/)

---

## 📌 Features

- **JWT Authentication & Authorization**: Secure signup, login, and token verification with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Student` and `Librarian` users.
- **Book Management (CRUD)**: Complete management of books, categories, inventory quantity, and status.
- **Borrow & Return System**: Students can borrow and return books with automated due date (14 days) and overdue tracking.
- **Transaction History**: Audit trail for all borrow/return operations across the library.
- **User Management**: Librarians can inspect all users, view individual profiles, update user roles, and remove accounts.
- **Rate Limiting**: Security against brute-force and DoS attacks (100 req/15 min global; 20 req/15 min on auth).
- **Validation**: Strict request body, param, and query validation via `express-validator`.
- **Security Headers & Logging**: Secured with `helmet`, `cors`, and custom request logger.
- **Interactive Swagger Documentation**: Full OpenAPI 3.0 specification served with Swagger UI at `/api-docs`.

---

## 🛠️ Technologies Required & Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Google Firebase Firestore (firebase-admin SDK)
- **Authentication**: JSON Web Token (`jsonwebtoken`) & `bcrypt`
- **Security**: `helmet`, `cors`, `express-rate-limit`
- **Validation**: `express-validator`
- **Documentation**: OpenAPI 3.0 via `swagger-ui-express` & `yaml`

---

## 📁 Project Structure

```text
├── .env                         # Environment variables (private)
├── .env.example                 # Example environment variables template
├── .gitignore                   # Git ignore file
├── package.json                 # Project dependencies & scripts
├── README.md                    # Project documentation
├── server.js                    # Main application entrypoint
├── docs/
│   └── swagger.yaml             # Complete OpenAPI 3.0 specification
└── src/
    ├── config/
    │   ├── firebase.js          # Firebase Admin SDK & Firestore initialization
    │   └── swagger.js           # Swagger UI configuration
    ├── controllers/
    │   ├── authController.js    # Authentication & profile handlers
    │   ├── bookController.js    # Books CRUD, borrow/return & transactions
    │   └── userController.js    # Librarian user management handlers
    ├── middleware/
    │   ├── auth.js              # JWT verification middleware
    │   ├── logger.js            # HTTP request logger
    │   ├── rateLimiter.js       # Rate limiting middleware
    │   ├── role.js              # Role-based access control middleware
    │   └── validator.js         # express-validator result handler
    ├── models/
    │   ├── bookModel.js         # Book Firestore operations
    │   ├── transactionModel.js  # Transaction Firestore operations
    │   └── userModel.js         # User Firestore operations
    └── utils/
        ├── jwt.js               # JWT sign & verify helpers
        └── validation.js        # Input validation chains
```

---

## 👥 User Roles & Permissions Matrix

| Endpoint | Method | Description | Access Role |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Register user (`student` or `librarian`) | Public |
| `/api/auth/login` | `POST` | Authenticate user & get JWT | Public |
| `/api/auth/profile` | `GET` | Get logged-in user profile | Authenticated |
| `/api/auth/profile` | `PUT` | Update profile information | Authenticated |
| `/api/books` | `GET` | View all books (supports filters) | Public / All |
| `/api/books/search` | `GET` | Search books by title/author/category | Public / All |
| `/api/books/:id` | `GET` | Get book details by ID | Public / All |
| `/api/books` | `POST` | Add a new book | **Librarian only** |
| `/api/books/:id` | `PUT` | Update book details / inventory | **Librarian only** |
| `/api/books/:id` | `DELETE` | Delete book | **Librarian only** |
| `/api/books/:id/borrow` | `POST` | Borrow a book copy (14 days due) | **Student only** |
| `/api/books/:id/return` | `POST` | Return a borrowed book | **Student only** |
| `/api/transactions` | `GET` | View all library transactions | **Librarian only** |
| `/api/transactions/my` | `GET` | View personal transaction history | Authenticated |
| `/api/users` | `GET` | View all registered users | **Librarian only** |
| `/api/users/:id` | `GET` | View specific user details | **Librarian only** |
| `/api/users/:id/role` | `PUT` | Update user role | **Librarian only** |
| `/api/users/:id` | `DELETE` | Delete user account | **Librarian only** |

---

## 🗄️ Firebase Firestore Schema

### 1. `users` Collection
```json
{
  "userId": "string (auto-generated ID)",
  "name": "string",
  "email": "string (unique, normalized)",
  "password": "string (bcrypt hash)",
  "role": "student | librarian",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 2. `books` Collection
```json
{
  "bookId": "string (auto-generated ID)",
  "title": "string",
  "author": "string",
  "isbn": "string",
  "category": "string",
  "status": "available | borrowed",
  "quantity": 5,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 3. `transactions` Collection
```json
{
  "transactionId": "string (auto-generated ID)",
  "userId": "string",
  "bookId": "string",
  "type": "borrow | return",
  "borrowDate": "timestamp",
  "returnDate": "timestamp | null",
  "dueDate": "timestamp (borrowDate + 14 days)",
  "status": "active | returned | overdue",
  "createdAt": "timestamp"
}
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Dhruv_Chavda_150096725060_Librar_Management
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Firebase credentials:
```bash
cp .env.example .env
```
Fill in the `.env` values:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Run the Application
- **Development mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

---

## 📖 API Documentation (Swagger)

Interactive Swagger / OpenAPI UI is accessible directly in your browser at:
- **`http://localhost:5000/api-docs`** (or `http://localhost:5000/api/docs`)
- OpenAPI JSON specification: **`http://localhost:5000/api/docs.json`**

To test authenticated endpoints in Swagger:
1. Call `POST /api/auth/login` to obtain your JWT token.
2. Click the **Authorize 🔓** button at the top right of Swagger UI.
3. Paste: `Bearer <your_token>` and click Authorize.

---

## 🧪 Testing with Postman / cURL

### 1. Register a Librarian
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Head Librarian",
    "email": "librarian@library.com",
    "password": "Password123",
    "role": "librarian"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "librarian@library.com",
    "password": "Password123"
  }'
```

### 3. Add a Book (Librarian)
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "category": "Software Engineering",
    "quantity": 3
  }'
```

### 4. Borrow a Book (Student)
```bash
curl -X POST http://localhost:5000/api/books/<BOOK_ID>/borrow \
  -H "Authorization: Bearer <STUDENT_TOKEN>"
```

### 5. Return a Book (Student)
```bash
curl -X POST http://localhost:5000/api/books/<BOOK_ID>/return \
  -H "Authorization: Bearer <STUDENT_TOKEN>"
```

---

## ✅ Submission Checklist

- [x] All API endpoints implemented
- [x] JWT authentication working
- [x] Role-based access control working (Student & Librarian)
- [x] Firebase Firestore CRUD operations working
- [x] Rate limiting implemented
- [x] Swagger documentation complete
- [x] Middleware functioning properly (Auth, Role, Logger, Rate Limiter, Validator)
- [x] `.env.example` included
- [x] `README.md` included with setup instructions
