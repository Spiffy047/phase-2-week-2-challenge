# Smart Goal Planner

## 🎯 Project Overview

The Smart Goal Planner is a user-friendly web application designed to help individuals set, track, and achieve their financial goals effectively. Built with **React.js** for the frontend, it provides a clean, intuitive interface to manage savings goals, monitor progress through a dynamic dashboard, and make deposits to stay on track.

For the backend, the application uses **`json-server`** as a lightweight, local mock API to store and manage your goals, making it easy to set up and run independently of a complex database.

## ✨ Features

* **Responsive Design:** Enjoy a seamless experience across various devices, from desktops to mobile phones.
* **Intuitive Navigation:** Easily switch between the Home, Dashboard, and Goals sections using the clean navigation bar.
* **Dynamic Dashboard:** Get a quick overview of your financial progress, including total goals, completed goals, on-track goals, past-due goals, and total amount saved.
* **Goal Management:**
    * **Add New Goals:** Create new financial goals with details like name, target amount, and target date.
    * **Edit Goals:** Modify existing goal details as your plans evolve.
    * **Delete Goals:** Remove goals you no longer need.
    * **Make Deposits:** Easily add funds to your goals, updating your saved amount and progress in real-time.
* **Goal Progress Tracking:** Visualize your progress with interactive progress bars for each goal.
* **Pagination:** Goals are displayed in manageable sections (4 goals per page) to prevent lengthy scrolling and improve readability.
* **Status Indicators:** Quickly see the status of each goal (Completed, On Track, Warning, Overdue).
* **Modal Forms:** Clean and unobtrusive modal pop-ups for adding and editing goals.

## 🚀 Technologies Used

* **Frontend:**
    * **React.js:** A JavaScript library for building user interfaces.
    * **React Router DOM:** For declarative routing within your Single Page Application (SPA).
    * **CSS3:** For all styling, ensuring a clean and modern UI.
* **Backend (Mock API):**
    * **json-server:** A full fake REST API that allows you to quickly set up a local backend with zero coding.

## ⚙️ Installation and Setup (Local Development)

Follow these steps to get the Smart Goal Planner up and running on your local machine for development.

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)

### Steps

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd smart-goal-planner
    ```
    *(Replace `<repository_url>` with the actual URL of your repository.)*

2.  **Install Frontend Dependencies:**
    Navigate into your project directory and install the required Node.js packages for the React application.
    ```bash
    npm install
    ```
    *(This will install `react`, `react-dom`, `react-router-dom`, etc.)*

3.  **Set Up the Backend (json-server):**
    Create a `db.json` file in the root of your project directory. This file will serve as your database.
    ```json
    // db.json
    {
      "goals": [
        {
          "id": "1",
          "name": "New Laptop",
          "targetAmount": 1200,
          "savedAmount": 750,
          "targetDate": "2025-12-31",
          "category": "Electronics",
          "createdAt": "2024-01-15T10:00:00Z"
        },
        {
          "id": "2",
          "name": "Vacation Fund (Bali)",
          "targetAmount": 3000,
          "savedAmount": 1500,
          "targetDate": "2025-09-01",
          "category": "Travel",
          "createdAt": "2024-02-20T14:30:00Z"
        },
        {
          "id": "3",
          "name": "Emergency Fund",
          "targetAmount": 5000,
          "savedAmount": 4800,
          "targetDate": "2025-07-25",
          "category": "Savings",
          "createdAt": "2024-03-01T08:15:00Z"
        },
        {
          "id": "4",
          "name": "New Smartphone",
          "targetAmount": 800,
          "savedAmount": 800,
          "targetDate": "2025-06-01",
          "category": "Electronics",
          "createdAt": "2024-04-10T11:00:00Z"
        },
        {
            "id": "5",
            "name": "Invest in Stocks",
            "targetAmount": 2000,
            "savedAmount": 100,
            "targetDate": "2026-01-01",
            "category": "Investments",
            "createdAt": "2025-01-05T09:00:00Z"
        }
      ]
    }
    ```
    *(You can add more sample goals or start with an empty array: `"goals": []`)*

4.  **Start the Backend Server:**
    Open a **new terminal window** (keep your first terminal open for the React app). Navigate to your project directory and start `json-server`.
    ```bash
    json-server --watch db.json --port 3001
    ```
    You should see output indicating that `json-server` is watching `db.json` and serving endpoints, typically at `http://localhost:3001/goals`.

5.  **Start the Frontend Development Server:**
    Go back to your **first terminal window** (where you installed dependencies) and start the React development server.
    ```bash
    npm start
    ```
    This will usually open the application in your default web browser at `http://localhost:3000`.

## 🚀 Deployment

The Smart Goal Planner is designed for easy deployment.

* **Frontend (React App on GitHub Pages):**
    The React application can be hosted as a static site directly from your GitHub repository using **GitHub Pages**. For this to work correctly, ensure your `package.json` includes the `homepage` field pointing to your GitHub Pages URL (e.g., `"homepage": "https://<your-github-username>.github.io/<your-repo-name>"`) and the `deploy` script (`"deploy": "gh-pages -d build"`).

* **Backend (`json-server` on Render):**
    While `json-server` is typically used for local development, for demonstration purposes or simple hosting of the mock API, it can be deployed to platforms like **Render**. You would need to set up a `web` service on Render, configuring it to run your `json-server` command (e.g., `json-server --watch db.json --port 10000` where `10000` is Render's default port for web services). Remember to update your `API_BASE_URL` in `App.js` to point to your deployed Render service's URL.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name` or `bugfix/bug-description`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Feel free to reach out to Joe M Kariuki via mwanikijoe1@gmail.com for any enquiries