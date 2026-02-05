# Joint Financial Tracker

A modern, full-stack personal finance tracker built with the MERN stack (MongoDB, Express, React, Node.js). It features advanced partner capabilities, allowing you to link accounts with a partner (spouse, roommate, business partner) to view shared finances, track joint expenses, and manage spending together.

## Features

*   **Financial Tracking**: Log income and expenses with customizable categories.
*   **Joint View**: Invite a partner to link accounts. Toggle between "My Records" and "Joint View" to see personal or combined financial data.
*   **Partner Management**: Send email invitations, view pending requests, and manage partner connections directly from the dashboard.
*   **Analytics Dashboard**: Visual breakdown of income vs. expenses, category spending, and monthly trends. Supports both personal and joint analytics.
*   **Secure Authentication**: User registration and login with JWT-based authentication.
*   **CSV Import**: Bulk import transactions from CSV files.
*   **Spender Management**: Track who made each transaction (e.g., "Me", "Partner", "Joint").

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Recharts (for analytics).
*   **Backend**: Node.js, Express.
*   **Database**: MongoDB (Mongoose ODM).
*   **Authentication**: JSON Web Tokens (JWT), bcryptjs.

## Getting Started

### Prerequisites

*   Node.js (v14+)
*   MongoDB (Local or Atlas URL)

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project root.

2.  **Install Backend Dependencies**:
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

#### Backend (.env)
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/financial-tracker
JWT_SECRET=your_jwt_secret_key_here
```

#### Frontend (.env)
Create a `.env` file in the `frontend/` directory if needed ( Vite uses `.env.local` by default):
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

You need to run both the backend server and the frontend client.

1.  **Start the Backend**:
    ```bash
    cd backend
    npm run dev
    # Server runs on http://localhost:5000
    ```

2.  **Start the Frontend**:
    ```bash
    cd frontend
    npm run dev
    # Client starts on http://localhost:5173 (or similar)
    ```

## Usage Guide

### Managing Partners
1.  Go to the **Dashboard**.
2.  Click **Manage Partners** in the left sidebar.
3.  Enter your partner's email to send an invite.
4.  Once they accept, their data will be available in the "Joint View".

### Joint View
1.  On the **Dashboard** or **Analytics** page.
2.  Use the **View Mode** toggle to switch between "My Records" and "Joint View".
3.  "Joint View" combines data from you and your accepted partner(s).

### Sorting Transactions
1.  In the Transactions table, click on column headers (Date, Spender, Category, Amount) to sort.
2.  Click again to toggle between Ascending and Descending order.
