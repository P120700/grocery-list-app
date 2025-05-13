# Grocery List App

A modern grocery list application built with React, TypeScript, and Vite that allows users to manage their shopping items efficiently.

## Features

- View, add, edit, and delete grocery items
- Mark items as bought with a simple checkbox
- Add amounts to each grocery item
- Responsive design that works on both desktop and mobile
- Data persistence using JSON-server

## Tech Stack

- **React + TypeScript**: For building the UI and type safety
- **Vite**: Fast build tool and development server
- **JSON-server**: Mock REST API for development
- **React Query**: Data fetching and server state management
- **Shadcn/ui**: Modern UI components
- **React Hook Form + Yup**: Form handling and validation
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd grocery-list-app
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server and JSON-server

```bash
# Start both the app and JSON server
npm run start
# or
yarn start

# Start just the app
npm run dev
# or
yarn dev

# Start just the JSON server
npm run json-server
# or
yarn json-server
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src/components`: Reusable UI components
- `/src/features`: Feature-specific components, hooks, and utilities
- `/src/services`: API services
- `/src/types`: TypeScript type definitions
- `/src/constants`: Application constants
- `/src/lib`: Shared utilities and configurations
