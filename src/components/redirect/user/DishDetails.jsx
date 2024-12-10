import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const TAG_OPTIONS = [
    "Vegan",
    "Vegetarian",
    "Lactose Intolerant",
    "Gluten Intolerant",
    "Kosher",
    "Halal",
];

function DishDetails({ user }) {
    const urlParams = useParams();
    const dishID = urlParams.dish;

    const [dishDetails, setDishDetails] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);

    const [editReviewId, setEditReviewId] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(5);

    useEffect(() => {
        const initializeFetch = async () => {
            await fetchDishDetails();
            await fetchDishReviews();
        };

        initializeFetch();
    }, [dishID]);

    const fetchDishDetails = async () => {
        try {
            const response = await fetch(`/api/dishes/details?id=${encodeURIComponent(dishID)}`);
            if (!response.ok) throw new Error("Failed to fetch dish details.");
            const data = await response.json();

            setDishDetails(data[0]);
            setTags(data[0].tags || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDishReviews = async () => {
        try {
            const response = await fetch(`/api/reviews/${dishID}`);
            if (!response.ok) throw new Error("Failed to fetch reviews.");
            const data = await response.json();
            setReviews(data.reviews || []);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    const handleReviewSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/reviews/${dishID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ comment, rating }),
            });

            if (response.ok) {
                setComment("");
                setRating(5);
                fetchDishReviews();
                setStatusMessage("Review added successfully!");
            } else {
                console.error("Failed to submit review.");
                setStatusMessage("Failed to submit review.");
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            setStatusMessage("Error submitting review.");
        } finally {
            setTimeout(() => setStatusMessage(""), 5000);
        }
    };

    const handleEditReviewSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/reviews/${editReviewId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ comment: editComment, rating: editRating }),
            });

            if (response.ok) {
                setEditReviewId(null);
                setEditComment("");
                setEditRating(5);
                fetchDishReviews();
                setStatusMessage("Review updated successfully!");
            } else {
                console.error("Failed to edit review.");
                setStatusMessage("Failed to edit review.");
            }
        } catch (err) {
            console.error("Error editing review:", err);
            setStatusMessage("Error editing review.");
        } finally {
            setTimeout(() => setStatusMessage(""), 5000);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                fetchDishReviews();
                setStatusMessage("Review deleted successfully!");
            } else {
                console.error("Failed to delete review.");
                setStatusMessage("Failed to delete review.");
            }
        } catch (err) {
            console.error("Error deleting review:", err);
            setStatusMessage("Error deleting review.");
        } finally {
            setTimeout(() => setStatusMessage(""), 5000);
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return "No ratings yet.";
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dish-details-container">
            {dishDetails ? (
                <>
                    <div className="dish-header">
                        <h1>{dishDetails.name}</h1>
                        <p className="restaurant-info">
                            <strong>Restaurant:</strong> {dishDetails.restaurant?.name || "Unknown Restaurant"}
                        </p>
                        <p className="location-info">
                            <strong>Location:</strong>{" "}
                            {dishDetails.restaurant
                                ? `${dishDetails.restaurant.address || ""}, ${dishDetails.restaurant.city || ""}, ${dishDetails.restaurant.state || ""}, ${dishDetails.restaurant.zip || ""}`
                                : "Location not available"}
                        </p>
                        <p className="dish-description">{dishDetails.description}</p>
                        <p className="average-rating">
                            <strong>Average Rating:</strong> {calculateAverageRating()}
                        </p>
                        {tags.length > 0 && (
                            <p className="dish-tags">
                                <strong>Tags:</strong> {tags.join(", ")}
                            </p>
                        )}
                    </div>

                    <div className="reviews-section">
                        <h2>Reviews</h2>
                        {statusMessage && <p className="status-message">{statusMessage}</p>}
                        <div className="reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review._id} className="review-item">
                                        {editReviewId === review._id ? (
                                            <form
                                                onSubmit={handleEditReviewSubmit}
                                                className="edit-review-form"
                                            >
                                                <textarea
                                                    placeholder="Edit your review here..."
                                                    value={editComment}
                                                    onChange={(e) =>
                                                        setEditComment(e.target.value)
                                                    }
                                                    required
                                                />
                                                <select
                                                    value={editRating}
                                                    onChange={(e) =>
                                                        setEditRating(Number(e.target.value))
                                                    }
                                                    required
                                                >
                                                    {[1, 2, 3, 4, 5].map((r) => (
                                                        <option key={r} value={r}>
                                                            {r} Star{r > 1 && "s"}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button type="submit" className="save-edit-button">
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    className="cancel-edit-button"
                                                    onClick={() => setEditReviewId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </form>
                                        ) : (
                                            <>
                                                <p>
                                                    <strong>{review.user?.username}:</strong>{" "}
                                                    {review.comment}
                                                </p>
                                                <p>Rating: {review.rating}/5</p>
                                                {user &&
                                                    user._id === review.user?._id && (
                                                        <>
                                                            <button
                                                                className="edit-button"
                                                                onClick={() => {
                                                                    setEditReviewId(review._id);
                                                                    setEditComment(review.comment);
                                                                    setEditRating(review.rating);
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="delete-button"
                                                                onClick={() =>
                                                                    handleDeleteReview(review._id)
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet. Be the first to review!</p>
                            )}
                        </div>

                        {user && (
                            <form onSubmit={handleReviewSubmit} className="review-form">
                                <textarea
                                    placeholder="Write your review here..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    className="review-textarea"
                                />
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    required
                                    className="rating-dropdown"
                                >
                                    {[1, 2, 3, 4, 5].map((r) => (
                                        <option key={r} value={r}>
                                            {r} Star{r > 1 && "s"}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" className="submit-review-button">
                                    Submit Review
                                </button>
                            </form>
                        )}
                    </div>
                </>
            ) : (
                <p>Dish details not found.</p>
            )}
        </div>
    );
}

export default DishDetails;