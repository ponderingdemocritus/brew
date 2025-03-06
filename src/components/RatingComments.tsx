import React, { useState, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { UIBeanComment } from "../lib/types";
import {
  getCommentsForRating,
  addComment,
  deleteComment,
} from "../services/beanRatingService";

interface RatingCommentsProps {
  ratingId: string;
}

const RatingComments: React.FC<RatingCommentsProps> = ({ ratingId }) => {
  const [comments, setComments] = useState<UIBeanComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getCommentsForRating(ratingId);
      setComments(data);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ratingId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const comment = await addComment(ratingId, newComment);
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (err: any) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err: any) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 p-4 border-t border-gray-100">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm">
          <p>{error}</p>
        </div>
      )}

      <h4 className="text-sm font-medium text-gray-700 mb-3">Comments</h4>

      {loading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8c7851]"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500 italic mb-4">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden flex-shrink-0">
                {comment.user_avatar ? (
                  <img
                    src={comment.user_avatar}
                    alt={comment.user_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs">
                    {comment.user_name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 bg-white p-3 rounded-lg shadow-sm text-sm">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-700">
                    {comment.user_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {comment.created_at_formatted}
                  </div>
                </div>
                <p className="mt-1 text-gray-600">{comment.comment}</p>
              </div>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                title="Delete comment"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmitComment} className="mt-4">
        <div className="flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border border-gray-200 rounded-l-md focus:ring-[#8c7851] focus:border-[#8c7851] text-sm"
            disabled={submitting}
          />
          <button
            type="submit"
            className="bg-[#8c7851] text-white p-2 rounded-r-md hover:bg-[#7a6a47] transition-colors disabled:opacity-50"
            disabled={!newComment.trim() || submitting}
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingComments;
