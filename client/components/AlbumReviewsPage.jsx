import React, { useState, useEffect } from 'react';
import './AlbumReviewsPage.css';
import ReviewModal from './Modal';

function AlbumReviews() {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

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
      const data = await response.json();
      console.log('updated review:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="review-container" style={{ marginTop: '10vh' }}>
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
          selectedAlbum={selectedReview}
          handleCloseModal={() => setShowModal(false)}
          rating={rating}
          setRating={setRating}
          modalTitle="Edit Review"
          comment={comment}
          setComment={setComment}
          isEditMode={true}
          handleSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}

export default AlbumReviews;
