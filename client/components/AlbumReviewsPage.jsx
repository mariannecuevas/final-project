import React, { useState, useEffect } from 'react';
import './AlbumReviewsPage.css';

function AlbumReviews() {
  const [reviews, setReviews] = useState([]);

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
                  <i className="fas fa-edit float-right"></i>
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
    </div>
  );
}

export default AlbumReviews;
