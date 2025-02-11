# Product Grid Dashboard

## Overview

A React-based dashboard application for managing products in a grid layout. The application implements a clean architecture pattern with domain-driven design principles, allowing users to organize products in rows with various alignment options and drag-and-drop functionality.

## Features

- **Row Management**

  - Create up to 3 rows
  - Delete rows
  - Drag and drop to reorder rows
  - Adjust row alignment (left, center, right)

- **Product Management**

  - Add random products to rows (max 3 products per row)
  - Remove products from rows
  - Drag and drop products between rows
  - Visual feedback when attempting to add products to full rows

- **Data Persistence**
  - Local storage implementation
  - Reset functionality to clear all data

## Technical Stack

- **Frontend Framework**: React
- **State Management**: Custom implementation with ViewModels
- **Testing**: Vitest + React Testing Library
- **UI Components**:
  - `@dnd-kit/core` for drag and drop
  - Motion for animations
  - Tailwind CSS for styling

## Architecture

The project follows Clean Architecture principles with the following layers:

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
