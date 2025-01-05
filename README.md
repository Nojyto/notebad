# **Notebad - Simple Text Editor**

**Notebad** is a simple text editor built using **Electron**, **React**, and **TailwindCSS**. The application features a custom draggable menu bar, tabbed file editing, and basic window controls. This project allows you to create, open, edit, and save text files seamlessly, with a focus on simplicity and responsiveness.

## **Development Setup**

Follow these steps to set up the development environment and run the project locally:

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd <repository-folder>
```

### **2. Install Dependencies**

Make sure you have Node.js and npm installed. Then, run:

```bash
npm install
```

### **3. Start the Development Server**

To start the development environment:

```bash
npm run dev
```

- This will open the app in a development Electron window with live reload.

## **Building the Application**

The build process generates binaries for your operating system. The default OS is detected automatically.

| Command        | Description                                 |
| --------------- | ------------------------------------------- |
| `npm run build` | Build the app for the current operating system. |
| `npm run build:win` | Build the app for Windows. |
| `npm run build:mac` | Build the app for macOS. |
| `npm run build:linux` | Build the app for Linux. |

## **File Structure Overview**

```bash
src/
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks (e.g., shortcuts)
├── pages/             # Main pages (e.g., EditorPage)
├── index.css          # TailwindCSS styles
└── main.tsx           # App entry point
electron/
├── main.ts            # Electron main process (app setup)
└── preload.ts         # Preload script for exposing APIs
```

---

## **Technologies Used**

- **Electron**: Desktop application framework.
- **React**: Frontend library for UI.
- **TailwindCSS**: Utility-first CSS framework.
- **TypeScript**: Static typing for better code quality.

## **Contributing**

Feel free to contribute by submitting issues or creating pull requests. All contributions are welcome!

## **License**

This project is licensed under the MIT License.

---

Enjoy using **Notebad**! 🎉
