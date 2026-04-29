import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Book, Review, AverageRating, CreateReviewData } from '../api'
import { getBookById, getAverageRating, getBookReviews, deleteBook, updateBook, createReview } from '../api'
import Navbar from '../components/Navbar'

export default function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const bookId = Number(id)

  const [book, setBook] = useState<Book | null>(null)
  const [rating, setRating] = useState<AverageRating | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editYear, setEditYear] = useState('')
  const [editLanguage, setEditLanguage] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  const [reviewUserName, setReviewUserName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    Promise.all([
      getBookById(bookId, controller.signal),
      getAverageRating(bookId, controller.signal),
      getBookReviews(bookId, controller.signal),
    ])
      .then(([bookRes, ratingRes, reviewsRes]) => {
        setBook(bookRes.data)
        setRating(ratingRes.data)
        setReviews(reviewsRes.data)
        setEditTitle(bookRes.data.title)
        setEditYear(String(bookRes.data.publishedYear))
        setEditLanguage(bookRes.data.language)
        setEditDescription(bookRes.data.description)
      })
      .catch(err => {
        if (err.name !== 'CanceledError') setError('Failed to load book')
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [bookId])

  function handleDelete() {
    if (!confirm('Are you sure you want to delete this book?')) return
    deleteBook(bookId)
      .then(() => navigate('/books'))
      .catch(() => alert('Failed to delete book'))
  }

  function handleSaveEdit() {
    setEditSaving(true)
    updateBook(bookId, {
      title: editTitle,
      publishedYear: Number(editYear),
      language: editLanguage,
      description: editDescription,
    })
      .then(res => { setBook(res.data); setEditing(false) })
      .catch(() => alert('Failed to update book'))
      .finally(() => setEditSaving(false))
  }

  function handleAddReview() {
    if (!reviewUserName || !reviewComment) {
      setReviewError('All fields are required')
      return
    }
    setReviewSubmitting(true)
    setReviewError(null)

    const data: CreateReviewData = {
      userName: reviewUserName,
      rating: reviewRating,
      comment: reviewComment,
    }

    createReview(bookId, data)
      .then(res => {
        setReviews(prev => [...prev, res.data])
        setReviewUserName('')
        setReviewRating(5)
        setReviewComment('')
      })
      .catch(() => setReviewError('Failed to submit review'))
      .finally(() => setReviewSubmitting(false))
  }

  const inputClass = "border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error || 'Book not found'}
          </div>
          <button onClick={() => navigate('/books')} className="mt-4 text-gray-500 hover:text-gray-800 dark:hover:text-white">
            Back to books
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => navigate('/books')}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4 block transition"
        >
          ← Back to books
        </button>

        {!editing ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{book.title}</h1>
            <p className="text-gray-400 text-sm mb-5">ISBN: {book.isbn}</p>

            <div className="grid grid-cols-2 gap-3 text-sm mb-5">
              <div><span className="font-medium text-gray-600 dark:text-gray-400">Author:</span> <span className="text-gray-800 dark:text-gray-200">{book.author?.firstName} {book.author?.lastName}</span></div>
              <div><span className="font-medium text-gray-600 dark:text-gray-400">Publisher:</span> <span className="text-gray-800 dark:text-gray-200">{book.publisher?.name}</span></div>
              <div><span className="font-medium text-gray-600 dark:text-gray-400">Year:</span> <span className="text-gray-800 dark:text-gray-200">{book.publishedYear}</span></div>
              <div><span className="font-medium text-gray-600 dark:text-gray-400">Pages:</span> <span className="text-gray-800 dark:text-gray-200">{book.pageCount}</span></div>
              <div><span className="font-medium text-gray-600 dark:text-gray-400">Language:</span> <span className="text-gray-800 dark:text-gray-200">{book.language}</span></div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Rating:</span>{' '}
                <span className="text-gray-800 dark:text-gray-200">
                  {rating?.averageRating ? `${rating.averageRating} / 5 (${rating.reviewCount} reviews)` : 'No ratings yet'}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">{book.description}</p>

            <div className="flex flex-wrap gap-1 mb-5">
              {book.genres?.map(g => (
                <span key={g.id} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setEditing(true)} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition">Edit</button>
              <button onClick={handleDelete} className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-sm transition border border-red-100 dark:border-red-900">Delete</button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Edit Book</h2>
            <div className="flex flex-col gap-3">
              <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" className={inputClass} />
              <input type="number" value={editYear} onChange={e => setEditYear(e.target.value)} placeholder="Published year" className={inputClass} />
              <input type="text" value={editLanguage} onChange={e => setEditLanguage(e.target.value)} placeholder="Language" className={inputClass} />
              <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Description" rows={4} className={inputClass} />
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} disabled={editSaving} className="bg-gray-800 dark:bg-white dark:text-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition">
                  {editSaving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Reviews ({reviews.length})</h2>
          {reviews.length === 0 && <p className="text-gray-400 text-sm">No reviews yet.</p>}
          <div className="flex flex-col gap-3">
            {reviews.map(review => (
              <div key={review.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800 dark:text-white">{review.userName}</span>
                  <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm">{review.rating}/5</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
                <p className="text-gray-400 text-xs mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add review */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Add a Review</h2>
          {reviewError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg mb-3 text-sm">{reviewError}</div>
          )}
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Your name" value={reviewUserName} onChange={e => setReviewUserName(e.target.value)} className={inputClass} />
            <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className={inputClass}>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
              ))}
            </select>
            <textarea placeholder="Your comment" value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={3} className={inputClass} />
            <button onClick={handleAddReview} disabled={reviewSubmitting} className="bg-gray-800 dark:bg-white dark:text-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50 transition">
              {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}