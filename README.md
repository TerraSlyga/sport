# Rivarly - Tournament Management Platform

A modern React-based web application for managing and tracking sports tournaments. Built with Vite, React 19, and Tailwind CSS for a fast, responsive user experience.

## Features

- 🏆 **Tournament Management** - Create, view, and manage sports tournaments
- 👥 **User Authentication** - Secure authentication system with context-based state management
- 📊 **Dashboard** - Comprehensive dashboard for tournament overview and statistics
- 🎨 **Responsive Design** - Modern UI built with Tailwind CSS and Lucide icons
- ⚡ **Fast Performance** - Built with Vite for optimal build times and HMR
- 🔀 **Client-side Routing** - Seamless navigation with React Router v7

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── buttons/         # Button components
│   ├── dashboard/       # Dashboard-specific components
│   ├── mainPage/        # Main page components
│   ├── background/      # Background and layout components
│   ├── TimeBadge.jsx    # Tournament time display
│   └── TournamentList.jsx # Tournament listing component
├── context/             # React Context for state management
│   └── AuthContext.jsx  # Authentication context
├── hooks/               # Custom React hooks
│   └── useTournaments.js # Tournament data management hook
├── pages/               # Page components
│   ├── MainPage.jsx     # Landing/home page
│   ├── Dashboard.jsx    # Main dashboard
│   ├── TournamentPage.jsx # Tournament details
│   └── CreateTournament.jsx # Tournament creation form
├── assets/              # Static assets
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Linting**: ESLint with React plugin
- **CSS Processing**: PostCSS & Autoprefixer

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd rivarlyReactFrontend
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build the project for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

## Configuration Files

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugin configuration
- `eslint.config.js` - ESLint rules and configuration

## Environment Setup

The application uses React Context API for state management, particularly for authentication. Make sure to set up your backend API endpoints in the appropriate context files.

## Browser Support

Works in all modern browsers that support ES2020+. Tested on:

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the Apache License 2.0. See [LICENSE.md](LICENSE.md) for details.

## Author

**Olexand Krupskyi** © 2026

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue in the repository.
