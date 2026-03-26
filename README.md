# Readverse

**Readverse** is a modern full-stack web application designed for book lovers. This project serves as a comprehensive digital solution for tracking reading progress, managing personal libraries, and fostering a community of readers.

## 📖 Project Overview
Readverse aims to replace traditional bookmarks with an intuitive, data-driven platform. Users can log their reading sessions, track progress by page count, visualize their reading habits, and earn rewards through a gamified badge system.

## 🚀 Key Features
*   **Library Management:** Effortlessly organize books into custom shelves ("Want to Read", "Currently Reading", "Read").
*   **Progress Tracking:** Integrated timer for reading sessions, automatic calculation of remaining pages, and estimated time to finish based on individual reading speed.
*   **Gamification:** A reward system that awards badges for consistency, reaching reading milestones, and maintaining reading streaks.
*   **Social Connectivity:** Search for friends, manage requests, and view real-time online/offline status.
*   **Personalized Recommendations:** Advanced suggestion engine powered by analyzing the user's reading history and preferred genres.
*   **Security First:** Robust authentication using JWT (JSON Web Tokens) and secure password hashing with `bcrypt`.

## 🛠 Tech Stack
The application is built using a modern, scalable full-stack architecture:

*   **Frontend:** React, Next.js, TypeScript, Tailwind CSS.
*   **Backend:** Node.js, TypeScript, GraphQL (Apollo Server).
*   **Database:** MySQL, managed through Prisma ORM.
*   **Infrastructure:** Docker for containerized deployment.
*   **Tools:** Figma (UI/UX design).


## 🐳 Docker Deployment

The project supports two main Docker workflows depending on your environment:

### 1. Development Mode (Local files)
This mode uses your local source code, allowing for hot-reloading. You will need to install dependencies manually before or during the process.
*   **Run:** 
    ```bash
    npm install
    docker-compose up
    ```
*   *Note: This configuration maps your local directory to the container, making it ideal for active development.*

### 2. Production Mode (Build from scratch)
This mode is designed to be self-contained. It pulls the necessary dependencies, builds the application, and prepares it for production deployment.
*   **Run:**
    ```bash
    docker-compose -f docker-compose.prod.yml up --build
    ```
*   *Note: This creates a clean, isolated image, suitable for staging or production environments.*

## 🏗 Architecture
Readverse utilizes **GraphQL** to allow efficient, flexible data fetching, minimizing over-fetching and under-fetching. The entire codebase is written in **TypeScript**, ensuring strong type safety across the full stack and improving long-term maintainability.

<img width="1907" height="839" alt="image" src="https://github.com/user-attachments/assets/2e5d4352-4e58-4f52-a580-00e6795af020" />
<img width="1910" height="851" alt="image" src="https://github.com/user-attachments/assets/3bedae49-f7c2-4a08-bdce-27faa916ba71" />

