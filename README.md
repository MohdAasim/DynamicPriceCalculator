# Dynamic Price Calculator

A responsive React application that allows users to dynamically calculate product prices based on various configurations, with support for saving configurations, comparing different options, and viewing price history.

## ✨ Features

- **Dynamic Price Calculation** - Calculate prices based on product size, color, add-ons, and quantity
- **Bulk Discounts** - Automatic discounts applied for larger quantities
- **Configuration Management**:
  - Save configurations with custom names to localStorage
  - Load saved configurations
  - Delete saved configurations
- **Shareable Configurations** - Generate and share URLs with encoded configurations
- **Comparison Tool** - Compare multiple product configurations side-by-side
- **Price History Chart** - View historical pricing trends
- **Responsive Design** - Optimized for all devices from mobile to desktop
- **Toast Notifications** - User-friendly feedback for actions

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 6
- **Language**: TypeScript 5.8
- **State Management**: React Hooks
- **Styling**: CSS with variables
- **Notifications**: React-Toastify
- **Storage**: LocalStorage API

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git https://github.com/MohdAasim/DynamicPriceCalculator.git
cd DynamicPriceCalculator

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/` or on your local network for device testing.

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Folder Structure

```
DynamicPriceCalculator/
├── src/
│   ├── components/
│   │   ├── PriceCalculator/
│   │   │   ├── ConfigPanel/
│   │   │   ├── PriceBreakdown/
│   │   │   ├── PriceHistory/
│   │   │   ├── Comparison/
│   │   │   └── SavedConfigurations/
│   ├── hooks/
│   │   └── usePriceCalculator.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── storageUtils.ts
│   ├── data/
│   │   └── productData.ts
│   ├── styles/
│   │   ├── variables.css
│   │   └── toast.css
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.js
├── .prettierrc
└── jest.config.js
```

## ⚙️ Configuration Options

The application allows configuration of the following product attributes:

- **Size**: Different size options with price adjustments
- **Color**: Various color options with price adjustments
- **Add-ons**: Optional features that can be added to the product
- **Quantity**: Number of items, with bulk discounts automatically applied

## 👥 Team Collaboration Strategy

### Git Workflow

We follow a feature branch workflow:

1. `main` - Production-ready code
2. `develop` - Latest development changes
3. Feature branches - Created from `develop` for each new feature

### Branch Naming Convention

- `feature/feature-name`
- `bugfix/issue-description`
- `hotfix/critical-fix`

### Code Review Process

1. All code changes require a pull request
2. At least one approval is required before merging
3. CI checks must pass (tests, linting)
4. Merge squash is preferred to keep a clean history

### Development Standards

- Code formatting handled by Prettier
- Code quality enforced by ESLint
- Pre-commit hooks managed by Husky
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

## 🧪 Testing

The project uses Jest and React Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Strategy

- **Unit Tests**: For utility functions, hooks, and isolated components
- **Integration Tests**: For component interactions
- **Snapshot Tests**: For UI component appearance
- **Coverage Goals**: Aim for at least 80% code coverage

## 🔄 Development Workflow

1. **Code Quality Tools**:
   - ESLint for static code analysis
   - Prettier for consistent code formatting
   - Husky for pre-commit hooks

2. **Available Scripts**:
   - `npm run dev` - Start development server
   - `npm run build` - Build for production
   - `npm run lint` - Run ESLint
   - `npm run format` - Format code with Prettier
   - `npm run preview` - Preview production build locally

3. **Continuous Integration**:
   - Automated testing on pull requests
   - Linting and type checking
   - Build verification

## 📦 Deployment

The application can be deployed to any static hosting service:

1. Run `npm run build` to generate optimized production files
2. Deploy the contents of the `dist` directory

Recommended hosting options:
- Vercel
- Netlify

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)

---
