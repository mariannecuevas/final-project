import React from 'react';

function ReviewModal({
  selectedAlbum,
  handleCloseModal,
  rating,
  setRating,
  modalTitle,
  comment,
  setComment,
}) {
  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating || !comment) {
      return;
    }

    const reviewData = {
      albumName: selectedAlbum.name,
      artist: selectedAlbum.artists[0].name,
      albumImg: selectedAlbum.images[1].url,
      rating,
      comment,
    };

    try {
      const response = await fetch('http://localhost:8080/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleCloseModal}></div>
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontFamily: 'roboto' }}>
                {modalTitle}
              </h5>
              <button
                type="button"
                className="close"
                onClick={handleCloseModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row mx-auto">
                <img
                  src={selectedAlbum.images[1].url}
                  className="img-thumbnail mx-auto"
                  alt={`Cover for ${selectedAlbum.name}`}
                />
              </div>
              <div className="row mx-auto" style={{ paddingTop: '2rem' }}>
                <div className="col-md-12">
                  <p className="text-left">
                    <strong>Album:</strong> {selectedAlbum.name}
                  </p>
                </div>
              </div>
              <div className="row mx-auto">
                <div className="col-md-12">
                  <p className="text-left">
                    <strong>Artist:</strong> {selectedAlbum.artists[0].name}
                  </p>
                </div>
              </div>
              <select
                id="ratingDropdown"
                value={rating}
                onChange={handleRatingChange}
                className="form-control"
                required>
                <option value="">Select a Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
              <textarea
                id="commentInput"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="form-control"
                rows="5"
                placeholder="Write your comment here..."
                style={{ marginTop: '1rem' }}
                required></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary mx-auto"
                style={{ fontFamily: 'roboto' }}
                onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewModal;
