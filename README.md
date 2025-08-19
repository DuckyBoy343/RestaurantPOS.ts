# Restaurant POS

A complete, full-stack Point of Sale (POS) desktop application built for restaurants to manage tables, orders, and sales. This application is built with a Node.js backend and a Next.js frontend, and is packaged for Windows using Electron.

---
## Features

* **User Authentication:** Secure login system with JWT.
* **Table Management:** Visual floor plan showing available and occupied tables.
* **Order Creation:** Intuitive interface for creating and updating dine-in and takeout orders.
* **Product Catalog:** Easy management of products and categories.
* **Sales and Checkout:** Functionality to finalize and pay for orders.
* **Desktop Application:** Packaged as a native Windows application for offline use.

---
## Technology Stack

### Frontend (Client)
* **Framework:** Next.js with React
* **Styling:** Bootstrap & Bootstrap Icons
* **State Management:** React Hooks (`useState`, `useEffect`)

### Backend & Desktop (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** SQLite with Knex.js as the query builder
* **Desktop Shell:** Electron
* **Packaging:** electron-builder

---
## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DuckyBoy343/RestaurantPOS.ts.git
    cd restaurant-pos
    ```

2.  **Install dependencies:**
    This project uses a unified `package.json` at the root.
    ```bash
    npm install
    ```

3.  **Set up Backend Environment Variables:**
    Create a file named `.env` in the **root** of the project and add your secret keys.
    ```env
    # A strong, secret key for signing JSON Web Tokens
    JWT_SECRET=your_super_secret_key_here
    PORT=4000
    ```

4.  **Set up Frontend Environment Variables:**
    Navigate into the `client` folder and create a file named `.env.local`. This tells the frontend where to find the API.
    ```bash
    cd client
    ```
    Create the `.env.local` file with this content:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:4000/api
    ```
    Then return to the root directory:
    ```bash
    cd ..
    ```

---
## Running the Application

### Development Mode (Web Browser)
This will start the Next.js frontend and the Node.js backend. You can access the application in your web browser at `http://localhost:3000`.

```bash
npm run dev
```
## Development Mode (Desktop App)
This will start the frontend and backend and launch the application in a development Electron window.

```bash
npm run desktop:dev
```

## Building for Production
This command will compile all parts of the application and create a distributable .exe installer in the /dist folder.

```bash
npm run dist
```
