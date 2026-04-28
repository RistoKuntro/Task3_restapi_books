import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type {
  Book,
  Review,
  AverageRating,
  CreateReviewData,
} from '../api'
import { getBookById, getAverageRating, getBookReviews, deleteBook, updateBook, createReview } from '../api'

export default function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const bookId = Number(id)

  const [book, setBook] = useState<Book | null>(null)
  const [rating, setRating] = useState<AverageRating | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit form state
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editYear, setEditYear] = useState('')
  const [editLanguage, setEditLanguage] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // Review form state
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
        if (err.name !== 'CanceledError') {
          setError('Failed to load book')
        }
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
      .then(res => {
        setBook(res.data)
        setEditing(false)
      })
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

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>
  }

  if (error || !book) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded">{error || 'Book not found'}</div>
        <button onClick={() => navigate('/books')} className="mt-4 text-blue-600 hover:underline">
          Back to books
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Back button */}
      <button
        onClick={() => navigate('/books')}
        className="text-blue-600 hover:underline mb-4 block"
      >
        Back to books
      </button>

      {/* Book info */}
      {!editing ? (
        <div className="border rounded-lg p-6 shadow-sm mb-6">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-500 text-sm mb-4">ISBN: {book.isbn}</p>

          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div><span className="font-medium">Author:</span> {book.author?.firstName} {book.author?.lastName}</div>
            <div><span className="font-medium">Publisher:</span> {book.publisher?.name}</div>
            <div><span className="font-medium">Year:</span> {book.publishedYear}</div>
            <div><span className="font-medium">Pages:</span> {book.pageCount}</div>
            <div><span className="font-medium">Language:</span> {book.language}</div>
            <div>
              <span className="font-medium">Rating:</span>{' '}
              {rating?.averageRating ? `${rating.averageRating} / 5 (${rating.reviewCount} reviews)` : 'No ratings yet'}
            </div>
          </div>

          <p className="text-gray-700 mb-4">{book.description}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {book.genres?.map(g => (
              <span key={g.id} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {g.name}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded hover:bg-yellow-200 text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        /* Edit form */
        <div className="border rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Edit Book</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="Title"
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              value={editYear}
              onChange={e => setEditYear(e.target.value)}
              placeholder="Published year"
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              value={editLanguage}
              onChange={e => setEditLanguage(e.target.value)}
              placeholder="Language"
              className="border rounded px-3 py-2"
            />
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              placeholder="Description"
              rows={4}
              className="border rounded px-3 py-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {editSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Reviews ({reviews.length})</h2>
        {reviews.length === 0 && (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        )}
        <div className="flex flex-col gap-3">
          {reviews.map(review => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{review.userName}</span>
                <span className="text-yellow-500 font-bold">{review.rating}/5</span>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
              <p className="text-gray-400 text-xs mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add review form */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3">Add a Review</h2>
        {reviewError && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-sm">{reviewError}</div>
        )}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={reviewUserName}
            onChange={e => setReviewUserName(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <select
            value={reviewRating}
            onChange={e => setReviewRating(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
            ))}
          </select>
          <textarea
            placeholder="Your comment"
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
            rows={3}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={handleAddReview}
            disabled={reviewSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}