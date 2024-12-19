
# Notebad

**Notebad** is a simple application combining Electron and React to create a desktop app with a modern UI. The project uses TypeScript, Vite, and Electron for a smooth development and build process.

## Features

- **React Frontend**: A responsive and interactive UI built with React and styled with CSS.
- **Electron Backend**: A lightweight desktop application framework for cross-platform compatibility.
- **TypeScript**: Ensures type safety and improved development experience.
- **Build and Distribution**: Cross-platform support for macOS, Linux, and Windows using `electron-builder`.

## File Structure

- **`electron/`**: Backend code for the Electron app.
- **`ui/`**: React frontend files.
- **`dist-electron/`**: Output directory for the Electron build.
- **`dist-react/`**: Output directory for the React build.

## Setup and Usage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/notebad.git
   cd notebad
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Development

```bash
npm run dev
```

### Build the Full Application

```bash
npm run build
```

### Distribution

Create Platform-Specific Builds:

- **macOS**: `npm run dist:mac`
- **Linux**: `npm run dist:linux`
- **Windows**: `npm run dist:win`

### Check for any linting issues

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```
