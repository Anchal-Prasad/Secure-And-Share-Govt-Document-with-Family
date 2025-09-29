# SecureDocShare

A modern web application built with React and TypeScript for securely sharing and managing government documents with family members.

🔗 **Live Demo**: [https://anchal-prasad.github.io/Secure-And-Share-Govt-Document-with-Family/](https://anchal-prasad.github.io/Secure-And-Share-Govt-Document-with-Family/)

## Overview

SecureDocShare provides a secure platform for families to manage and share important government documents like Aadhaar cards, ensuring privacy and easy access when needed.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your system.
- [Install Node.js with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

Follow these steps to get the project running locally:

```sh
# Step 1: Clone the repository
git clone https://github.com/anchal-prasad/Secure-And-Share-Govt-Document-with-Family.git

# Step 2: Navigate to the project directory
cd Secure-And-Share-Govt-Document-with-Family

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

## Features

- 🔒 Secure document storage and sharing
- 👨‍👩‍👧‍👦 Family-centric access management
- 📄 Government document handling (Aadhaar, etc.)
- 🎨 Modern, responsive UI
- ⚡ Fast and optimized performance

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

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

This application is deployed on **GitHub Pages** and can also be deployed to various other platforms:

- **GitHub Pages**: Automated deployment via GitHub Actions (current deployment)
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **Any static hosting service**: Upload the contents of the `dist` folder

### Deploying to GitHub Pages

The project is configured for GitHub Pages deployment. Push to the main branch to trigger automatic deployment.



## Author

**Anchal Prasad**
- GitHub: [@anchal-prasad](https://github.com/anchal-prasad)

