import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book, Pagination, BookQuery } from '../api'
import { getBooks, deleteBook } from '../api'

export default function BooksPage() {
  const navigate = useNavigate()

  const [books, setBooks] = useState<Book[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [year, setYear] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [order, setOrder] = useState('asc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const controller = new AbortController()

    const query: BookQuery = {
      page,
      limit: 10,
      ...(title && { title }),
      ...(language && { language }),
      ...(year && { year }),
      ...(sortBy && { sortBy }),
      ...(sortBy && { order }),
    }

    setLoading(true)
    setError(null)

    getBooks(query, controller.signal)
      .then(res => {
        setBooks(res.data.data)
        setPagination(res.data.pagination)
      })
      .catch(err => {
        if (err.name !== 'CanceledError') {
          setError('Failed to load books')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [title, language, year, sortBy, order, page])

  function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this book?')) return
    deleteBook(id)
      .then(() => setBooks(prev => prev.filter(b => b.id !== id)))
      .catch(() => alert('Failed to delete book'))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Books</h1>
          <button
            onClick={() => navigate('/books/new')}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Add Book
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={title}
            onChange={e => { setTitle(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <input
            type="text"
            placeholder="Language..."
            value={language}
            onChange={e => { setLanguage(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <input
            type="number"
            placeholder="Year..."
            value={year}
            onChange={e => { setYear(e.target.value); setPage(1) }}
            className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <select
            value={`${sortBy}-${order}`}
            onChange={e => {
              const [s, o] = e.target.value.split('-')
              setSortBy(s)
              setOrder(o)
              setPage(1)
            }}
            className="border border-gray-200 rounded-lg px-3 py-2 w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="-asc">Sort by...</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="publishedYear-asc">Year oldest</option>
            <option value="publishedYear-desc">Year newest</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        {/* Books grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {books.map(book => (
              <div key={book.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-800">{book.title}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {book.author?.firstName} {book.author?.lastName} · {book.publishedYear}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {book.genres?.map(g => (
                    <span key={g.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">
                      {g.name}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/books/${book.id}`)}
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 text-sm transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 text-sm transition border border-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && books.length === 0 && (
          <div className="text-center py-10 text-gray-400">No books found</div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}