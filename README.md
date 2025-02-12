# Inditex Row Experience

## 🚀 Overview

A modern React application for managing dynamic product rows with drag-and-drop functionality, built with Clean Architecture principles and TypeScript.

## 🛠 Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- DND Kit
- Vitest
- PNPM

## 📋 Prerequisites

- Node.js (v20.11.1 or higher)
- PNPM (v10.2.0 or higher)

## 🔧 Installation

\`\`\`bash

# Clone the repository

git clone [repository-url]

# Navigate to project directory

cd inditex-row-experience

# Install dependencies

pnpm install
\`\`\`

## 🚀 Running the Application

\`\`\`bash

# Development mode

pnpm dev

# Build for production

pnpm build

# Preview production build

pnpm preview
\`\`\`

## 🧪 Testing

\`\`\`bash

# Run tests

pnpm test

# Run tests with coverage

pnpm test:coverage

# Run tests in watch mode

pnpm test:watch
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── application/ # Application business rules
│ ├── ports/ # Interface definitions
│ └── useCases/ # Application use cases
├── domain/ # Enterprise business rules
│ ├── entities/ # Domain entities
│ ├── services/ # Domain services
│ └── valueObjects/ # Value objects
├── infrastructure/ # Frameworks and drivers
│ ├── persistence/ # Data persistence implementations
│ └── repositories/ # Repository implementations
└── presentation/ # Interface adapters
├── components/ # React components
└── viewModels/ # View models
\`\`\`

## 🎯 Key Features

- **Dynamic Row Management**

  - Create up to 3 rows
  - Drag and drop products between rows
  - Adjust row alignment (Left, Center, Right)
  - Maximum 3 products per row

- **Modern UI/UX**

  - Smooth animations with Framer Motion
  - Responsive design with Tailwind CSS
  - Intuitive drag and drop with DND Kit
  - Visual feedback for user actions

- **Data Persistence**
  - Local storage implementation
  - Clean Architecture approach
  - Repository pattern for data access

## 🏗 Architecture

The project follows Clean Architecture principles with four main layers:

1. **Domain Layer**

   - Core business logic
   - Entity definitions (Product, Row)
   - Value objects (Alignment)

2. **Application Layer**

   - Use cases for business operations
   - Port definitions for repositories
   - Business rules implementation

3. **Infrastructure Layer**

   - Repository implementations
   - Local storage persistence
   - External service adapters

4. **Presentation Layer**
   - React components
   - View models
   - UI state management

## 🧩 Code Quality

- ESLint configuration for code quality
- Prettier for consistent formatting
- Vitest for unit and integration testing
- TypeScript for type safety
- +77% test coverage

## 📝 Available Scripts

\`\`\`bash

# Development

pnpm dev # Start development server
pnpm build # Build for production
pnpm preview # Preview production build

# Testing

pnpm test # Run tests
pnpm test:watch # Run tests in watch mode
pnpm test:coverage # Run tests with coverage

# Code Quality

pnpm lint # Run ESLint
pnpm format # Run Prettier
\`\`\`

## 🔄 State Management

- Local state with React hooks
- ViewModel pattern for business logic
- Repository pattern for data persistence
- Clean Architecture for separation of concerns

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 🎨 UI Components

- Dashboard: Main container component
- RowItem: Individual row component
- ProductCard: Product display component
- ProductList: Product container component

## 🔍 Future Improvements

- Implement CI/CD pipeline
- Add E2E testing with Cypress
- Improve test coverage
- Add internationalization
- Implement server-side persistence
- Add user authentication
- Enhance mobile experience

## 👥 Author

Ángel Hernández Pascual

---

Built with ❤️ for Inditex
