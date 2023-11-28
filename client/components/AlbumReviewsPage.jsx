import React, { useState, useEffect } from 'react';
import './AlbumReviewsPage.css';
import ReviewModal from './Modal';
import './DeleteModal.css';

function AlbumReviews() {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/reviews')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const openEditModal = (review) => {
    console.log('Selected Review:', review);
    setSelectedReview(review);
    setShowModal(true);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleEditSubmit = async (reviewData) => {
    try {
      const response = await fetch(
        `http://localhost:8080/reviews/${selectedReview.reviewId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.reviewId === selectedReview.reviewId
            ? { ...review, ...reviewData }
            : review
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openDeleteModal = (review) => {
    console.log('Opening delete modal');
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/reviews/${selectedReview.reviewId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews((prevReviews) =>
        prevReviews.filter(
          (review) => review.reviewId !== selectedReview.reviewId
        )
      );

      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="review-container">
      <div className="row">
        <div className="col">
          <h3>Album Reviews</h3>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.reviewId} className="review">
                <img
                  src={review.albumImg}
                  className="img-thumbnail"
                  alt={`Cover for ${review.albumName}`}
                />
                <div className="review-details">
                  <i
                    className="fa fa-trash float-right"
                    style={{
                      cursor: 'pointer',
                      marginLeft: '1rem',
                    }}
                    onClick={() => openDeleteModal(review)}></i>
                  <i
                    className="fas fa-edit float-right"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openEditModal(review)}></i>
                  <p className="text-left">
                    <strong>Artist:</strong> {review.artist}
                  </p>
                  <p className="text-left">
                    <strong>Album:</strong> {review.albumName}
                  </p>
                  <p className="text-left">
                    <strong>Rating:</strong> {review.rating}
                  </p>
                  <p className="text-left">
                    <strong>Comment:</strong> {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <ReviewModal
          selectedReview={selectedReview}
          handleCloseModal={() => setShowModal(false)}
          rating={rating}
          setRating={setRating}
          comment={comment}
          modalTitle="Edit Review"
          setComment={setComment}
          isEditMode={true}
          handleSubmit={handleEditSubmit}
        />
      )}
      {showDeleteModal && (
        <>
          <div
            className={`delete-overlay ${showDeleteModal ? 'active' : ''}`}
          />
          <div className="delete-modal">
            <p>Are you sure you want to delete this review?</p>
            <button className="delete-btn" onClick={handleDeleteSubmit}>
              DELETE
            </button>
            <button
              className="cancel-btn"
              onClick={() => setShowDeleteModal(false)}>
              CANCEL
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AlbumReviews;
