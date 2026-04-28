import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Author, Publisher, Genre } from '../api'
import { createBook, getAuthors, getPublishers, getGenres } from '../api'

export default function AddBookPage() {
  const navigate = useNavigate()

  const [authors, setAuthors] = useState<Author[]>([])
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [genres, setGenres] = useState<Genre[]>([])

  const [title, setTitle] = useState('')
  const [isbn, setIsbn] = useState('')
  const [publishedYear, setPublishedYear] = useState('')
  const [pageCount, setPageCount] = useState('')
  const [language, setLanguage] = useState('')
  const [description, setDescription] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [publisherId, setPublisherId] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      getAuthors(controller.signal),
      getPublishers(controller.signal),
      getGenres(controller.signal),
    ])
      .then(([authorsRes, publishersRes, genresRes]) => {
        setAuthors(authorsRes.data)
        setPublishers(publishersRes.data)
        setGenres(genresRes.data)
      })
      .catch(err => {
        if (err.name !== 'CanceledError') {
          setError('Failed to load form data')
        }
      })

    return () => controller.abort()
  }, [])

  function toggleGenre(id: number) {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  function handleSubmit() {
    if (!title || !isbn || !publishedYear || !pageCount || !language || !description || !authorId || !publisherId) {
      setError('All fields are required')
      return
    }

    setSubmitting(true)
    setError(null)

    createBook({
      title,
      isbn,
      publishedYear: Number(publishedYear),
      pageCount: Number(pageCount),
      language,
      description,
      authorId: Number(authorId),
      publisherId: Number(publisherId),
      genres: selectedGenres,
    })
      .then(res => navigate(`/books/${res.data.id}`))
      .catch(err => {
        if (err.response?.data?.error) {
          setError(err.response.data.error)
        } else {
          setError('Failed to create book')
        }
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => navigate('/books')}
        className="text-blue-600 hover:underline mb-4 block"
      >
        Back to books
      </button>

      <h1 className="text-3xl font-bold mb-6">Add New Book</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ISBN</label>
          <input
            type="text"
            value={isbn}
            onChange={e => setIsbn(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Published Year</label>
            <input
              type="number"
              value={publishedYear}
              onChange={e => setPublishedYear(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Page Count</label>
            <input
              type="number"
              value={pageCount}
              onChange={e => setPageCount(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <input
            type="text"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <select
            value={authorId}
            onChange={e => setAuthorId(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select author...</option>
            {authors.map(a => (
              <option key={a.id} value={a.id}>
                {a.firstName} {a.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Publisher</label>
          <select
            value={publisherId}
            onChange={e => setPublisherId(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select publisher...</option>
            {publishers.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres.map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  selectedGenres.includes(g.id)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Book'}
          </button>
          <button
            onClick={() => navigate('/books')}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}