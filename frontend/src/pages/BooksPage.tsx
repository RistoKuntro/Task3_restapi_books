import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBooks, deleteBook, Book, Pagination, BookQuery } from '../api'

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
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Books</h1>
        <button
          onClick={() => navigate('/books/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Book
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={title}
          onChange={e => { setTitle(e.target.value); setPage(1) }}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Language..."
          value={language}
          onChange={e => { setLanguage(e.target.value); setPage(1) }}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="number"
          placeholder="Year..."
          value={year}
          onChange={e => { setYear(e.target.value); setPage(1) }}
          className="border rounded px-3 py-2 w-full"
        />
        <select
          value={`${sortBy}-${order}`}
          onChange={e => {
            const [s, o] = e.target.value.split('-')
            setSortBy(s)
            setOrder(o)
            setPage(1)
          }}
          className="border rounded px-3 py-2 w-full"
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
        <div className="text-center py-10 text-gray-500">Loading...</div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}

      {/* Books grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {books.map(book => (
            <div key={book.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-gray-600 text-sm">
                {book.author?.firstName} {book.author?.lastName} · {book.publishedYear}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {book.genres?.map(g => (
                  <span key={g.id} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                    {g.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/books/${book.id}`)}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
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
        <div className="text-center py-10 text-gray-500">No books found</div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={!pagination.hasPreviousPage}
            className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}