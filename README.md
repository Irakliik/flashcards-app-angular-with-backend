# Flashcards App

A simple flashcards web application to help you learn and memorize terms. This app allows users to create, edit, and delete flashcards. It is built with **Angular** for the frontend and **Node.js** with **MySQL** for the backend.

## Features

- Create new flashcards
- Update existing flashcards
- Edit the currently displayed flashcard directly
- Remove flashcards
- Flip cards to switch between term and definition
- Shuffle mode for randomized practice

## Project Structure

- `flashcards-app-angular/` — Angular frontend
- `flashcards-app-node/` — Node.js backend

## Setup Instructions

1. **Backend Setup (Node.js + MySQL)**

   - Navigate to the Node.js folder:

     ```bash
     cd flashcards-app-node
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Configure the database:

     - Open `util/database.js`
     - Update your MySQL server credentials (`host`, `user`, `password`, `database`)

   - Start the backend server:

     ```bash
     npm start
     ```

2. **Frontend Setup (Angular)**

   - Open a new terminal and navigate to the Angular folder:

     ```bash
     cd flashcards-app-angular
     ```

   - Install Angular dependencies:

     ```bash
     npm install
     ```

   - Serve the Angular app:

     ```bash
     ng serve
     ```

   - Open your browser at `http://localhost:4200`

## Notes

- Make sure your MySQL server is running before starting the backend.
- Make sure the database is created.


