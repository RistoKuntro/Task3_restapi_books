import { useTheme } from '../ThemeContext'

export default function Navbar() {
  const { dark, toggleTheme } = useTheme()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center">
      <span className="font-bold text-gray-800 dark:text-white text-lg">Books API</span>

      <button
        onClick={toggleTheme}
        className="relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none"
        style={{ backgroundColor: dark ? '#4b5563' : '#d1d5db' }}
        aria-label="Toggle dark mode"
      >
        <span
          className="inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300"
          style={{ transform: dark ? 'translateX(1.5rem)' : 'translateX(0.125rem)' }}
        />
      </button>
    </nav>
  )
}