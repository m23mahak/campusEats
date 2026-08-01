# CampusEats 🍱

CampusEats is a complete, full-stack campus food and goods delivery application. It allows students to order from various campus vendors, delivery agents to pick up and deliver orders, and vendors/admins to manage operations.

## Features

- **Multi-role Authentication:** Customer (Student/Staff), Vendor, Delivery Agent, and Admin roles.
- **Dynamic Product Catalog:** Menu and store items are fetched dynamically from the database.
- **Role-Based Access Control:** Only vendors and admins can manage all orders, while customers see only their own.
- **Demo Login:** Quick 1-click demo login buttons for testing each role easily.
- **PostgreSQL Ready:** Uses PostgreSQL instead of SQLite for full data persistence on platforms like Render.

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript (no complex build steps)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with `pg` module)
- **Authentication:** JWT (JSON Web Tokens) & `bcryptjs` for password hashing.

## Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) running locally (or a remote DB like Neon/Supabase)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/campus-delivery.git
cd campus-delivery
```

### 2. Install dependencies
```bash
npm install
```
*(This automatically runs a `postinstall` script to install backend dependencies.)*

### 3. Setup Environment Variables
Navigate to the `backend/` folder and copy the example environment file:
```bash
cd backend
cp .env.example .env
```
Edit the `.env` file with your PostgreSQL connection string:
```env
PORT=3000
JWT_SECRET=super_secret_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/campuseats
```

### 4. Start the Application
From the root of the project, run:
```bash
npm start
```
The server will automatically:
1. Connect to your database.
2. Create the necessary tables (`users`, `products`, `orders`, `order_items`).
3. Seed the database with demo users and products.
4. Serve the frontend at `http://localhost:3000`.

## Deployment (Render.com)

This codebase is 100% configured for seamless deployment on [Render](https://render.com/).

1. Create a new **Web Service** on Render and connect this repository.
2. Configure the settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add the following **Environment Variables**:
   - `DATABASE_URL`: Your production PostgreSQL connection string (e.g., Neon or Render Postgres).
   - `JWT_SECRET`: A secure random string for signing tokens.
4. Click **Deploy**.

Render will automatically install the backend dependencies, bind to the correct port (`0.0.0.0`), and serve both the API and the frontend from a single web service.

## Project Structure

```
campus-delivery/
├── frontend/           # Static HTML, CSS, and JS files
│   ├── index.html      # Login/Register page
│   ├── home.html       # Product browsing & cart
│   ├── config.js       # Central API configuration
│   └── ...
├── backend/            # Express REST API
│   ├── server.js       # App entry point & static file serving
│   ├── database.js     # DB connection & auto-seeding logic
│   └── routes/         # API endpoints (auth, orders, products)
├── package.json        # Root scripts for easy deployment
└── .gitignore          # Ignored files (.env, node_modules, etc.)
```
