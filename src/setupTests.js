// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// src/setupTests.js

// Mocks para react-router-dom-
//simula las funciones principales de React Router sin necesitar un navegador real.
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // conserva el resto
    Link: ({ children }) => <a>{children}</a>,
    NavLink: ({ children }) => <a>{children}</a>,
    useNavigate: () => jest.fn(),
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => element,
}));

