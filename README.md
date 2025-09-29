# adhaar-link-docs

A modern web application built with React and TypeScript for sports enthusiasts.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your system.
- [Install Node.js with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

Follow these steps to get the project running locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Development

### Local Development

To start developing locally:

```sh
npm run dev
```

This will start the development server with hot-reload enabled.

### Building for Production

To create a production build:

```sh
npm run build
```

### Preview Production Build

To preview the production build locally:

```sh
npm run preview
```

## Technology Stack

This project is built using modern web technologies:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library with React SWC for fast refresh
- **shadcn/ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── types/         # TypeScript type definitions
└── styles/        # Global styles and Tailwind config
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

This application can be deployed to various platforms:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Any static hosting service**: Upload the contents of the `dist` folder

