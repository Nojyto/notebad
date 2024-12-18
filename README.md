
# Notebad

**Notebad** is a simple application combining Electron and React to create a desktop app with a modern UI. The project uses TypeScript, Vite, and Electron for a smooth development and build process.

## Features

- **React Frontend**: A responsive and interactive UI built with React and styled with CSS.
- **Electron Backend**: A lightweight desktop application framework for cross-platform compatibility.
- **TypeScript**: Ensures type safety and improved development experience.
- **Build and Distribution**: Cross-platform support for macOS, Linux, and Windows using `electron-builder`.

## Requirements

- **Node.js**: v16 or higher
- **npm**: v7 or higher

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

---

### Development

**Start the React Development Server**:

```bash
npm run dev:react
```

This starts the Vite development server for the React frontend.

**Start the Electron Application**:

```bash
npm run dev:electron
```

Runs the Electron app using the compiled React build.

---

### Build

**Build the Full Application**:

```bash
npm run build
```

This command compiles both the React frontend and the Electron backend.

**Transpile Electron**:

```bash
npm run transpile:electron
```

Compiles only the Electron backend code.

---

### Distribution

**Create Platform-Specific Builds**:

- **macOS**: `npm run dist:mac`
- **Linux**: `npm run dist:linux`
- **Windows**: `npm run dist:win`

These commands package the application for the respective platforms using `electron-builder`.

---

### Additional Commands

**Lint Code**:

```bash
npm run lint
```

Checks the code for any linting issues.

**Preview Production Build**:

```bash
npm run preview
```

Serves the React build for a final check before packaging.

---

### File Structure

- **`electron/`**: Backend code for the Electron app.
- **`ui/`**: React frontend files.
- **`dist-electron/`**: Output directory for the Electron build.
- **`dist-react/`**: Output directory for the React build.

---
