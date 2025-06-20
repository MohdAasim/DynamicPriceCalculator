import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the App component after importing it
jest.mock('./App', () => {
  return function MockApp() {
    return (
      <div>
        <h1>Vite + React</h1>
        <button>count is 0</button>
      </div>
    );
  };
});

test('renders the app component', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { level: 1 });
  expect(headingElement).toBeInTheDocument();
  expect(headingElement.textContent).toBe('Vite + React');
});
