import { useState } from "react";
import Star from "../Helpers/icons/Star";
import LoaderStyleOne from "../Helpers/Loaders/LoaderStyleOne";
import StarRating from "../Helpers/StarRating";
import { addReview, replyReview } from "../../api/reviewApi";
import { getUserById, hasUserPurchasedProduct } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { message } from 'antd'
export default function Reviews({
  comments,
  rating,
  ratingHandler,
  reviewMessage,
  messageHandler,
  hoverRating,
  hoverHandler,
  productId,
  userId,
}) {
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [reviewSubmissionLoading, setReviewSubmissionLoading] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();

  const toggleReply = (commentId) => {
    if (replyCommentId === commentId) {
      setReplyCommentId(null);
    } else {
      setReplyCommentId(commentId);
    }
  };

  const handleReplySubmit = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Bạn phải login để đánh giá sản phẩm');
      return;
    }

    if (replyMessage.trim() === "") return;
    setReplyLoading(true);
    try {
      await replyReview({
        productId,
        userId: userInfo.id,
        parentReviewId: commentId,
        content: replyMessage,
      });
      setReplyMessage("");
      setReplyCommentId(null);
      window.location.reload();

    } catch (error) {
      console.error("Lỗi khi gửi trả lời:", error);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleReviewSubmit = async () => {

    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Bạn phải login để đánh giá sản phẩm');
      return;
    }

    // try {
    //   const userData = await getUserById(userInfo.id);

    //   if (!hasUserPurchasedProduct(userData, productId)) {
    //     message.error('Bạn phải mua sản phẩm trước khi có thể đánh giá.');
    //     return;
    //   }
    // } catch (error) {
    //   console.error('Lỗi khi lấy thông tin người dùng:', error);
    // }

    if (reviewMessage.trim() === "" || rating === 0) return;
    setReviewSubmissionLoading(true);
    try {
      await addReview({
        productId,
        userId: userInfo.id,
        rating,
        content: reviewMessage,
      });
      messageHandler({ target: { value: "" } });
      ratingHandler(0);
      setErrorMessage('');
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    } finally {
      setReviewSubmissionLoading(false);
    }
  };

  return (
    <div className="review-wrapper w-full">
      <div className="w-full reviews mb-[60px]">
        {/* comments */}
        <div className="w-full comments mb-[60px]">
          {comments &&
            comments.length > 0 &&
            comments.map((comment) => (
              <div
                key={comment.id}
                className="comment-item bg-white px-10 py-[32px] mb-2.5"
              >
                <div className="comment-author flex justify-between items-center mb-3">
                  <div className="flex space-x-3 items-center">
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                      <img
                        src={comment.user.profile.avatar || "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[18px] font-medium text-qblack">
                        {comment.user.profile.fullName}
                      </p>
                      <p className="text-[13px] font-normal text-qgray">
                        {comment.user.profile.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {Array.from(Array(comment.rating), () => (
                        <span key={Math.random()}>
                          <Star />
                        </span>
                      ))}
                    </div>
                    <span className="text-[13px] font-normal text-qblack mt-1 inline-block">
                      ({comment.rating}.0)
                    </span>
                  </div>
                </div>
                <div className="comment mb-[30px]">
                  <p className="text-[15px] text-qgray leading-7 text-normal">
                    {comment.content}
                  </p>
                </div>

                {/* Hiển thị trả lời nếu có */}
                {comment.replys &&
                  comment.replys.length > 0 &&
                  comment.replys.map((reply) => (
                    <div
                      key={reply.id}
                      className="sub-comment-item bg-white px-10 pt-[32px] border-t"
                    >
                      <div className="comment-author  mb-3">
                        <div className="flex space-x-3 items-center">
                          <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                            <img
                              src={reply.user.profile.avatar || "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740"}
                              alt="User Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[18px] font-medium text-qblack">
                              {reply.user.profile.fullName}
                            </p>
                            <p className="text-[13px] font-normal text-qgray">
                              {reply.user.profile.address}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="comment mb-[10px]">
                        <p className="text-[15px] text-qgray leading-7 text-normal">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}

                {/* Nút trả lời */}
                {/* <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => toggleReply(comment.id)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Trả lời
                  </button>
                </div> */}
                {comment.replies &&
                  comment.replies.length > 0 &&
                  comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="reply-item bg-gray-100 px-8 py-4 ml-12 mt-4"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                          <img
                            src={reply.user.profile.avatar}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[16px] font-medium text-qblack">
                            {reply.user.profile.fullName}
                          </p>
                        </div>
                      </div>
                      <div className="reply-content mb-[20px]">
                        <p className="text-[14px] text-qgray leading-6">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}

                {/* Hiển thị form trả lời khi nhấn vào nút Trả lời */}
                {replyCommentId === comment.id && (
                  <div className="mt-4">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Nhập nội dung trả lời..."
                      className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        className="black-btn w-[150px] h-[40px] flex justify-center items-center"
                      >
                        <span className="flex space-x-1 items-center h-full">
                          <span className="text-sm font-semibold">
                            {replyLoading ? (
                              <span className="w-5">
                                <LoaderStyleOne />
                              </span>
                            ) : (
                              "Gửi trả lời"
                            )}
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* load comments
        <div className="w-full flex justify-center">
          <button
            type="button"
            className="black-btn w-[300px] h-[50px] text-sm font-semibold"
          >
            Load More
          </button>
        </div> */}
      </div>

      {/* Form để viết đánh giá */}
      <div className="write-review w-full">
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <h1 className="text-2xl font-medium text-qblack mb-5">
          Viết đánh giá của bạn
        </h1>

        <div className="flex space-x-1 items-center mb-[30px]">
          <StarRating
            hoverRating={hoverRating}
            hoverHandler={hoverHandler}
            rating={rating}
            ratingHandler={ratingHandler}
          />
          <span className="text-qblack text-[15px] font-normal mt-1">
            ({rating}.0)
          </span>
        </div>

        <div className="w-full review-form">
          <div className="w-full mb-[30px]">
            <h6 className="input-label text-qgray capitalize text-[13px] font-normal block mb-2">
              Nội dung bình luận *
            </h6>
            <textarea
              value={reviewMessage}
              onChange={messageHandler}
              name="comment"
              id="comment"
              cols="30"
              rows="3"
              className="w-full focus:ring-0 focus:outline-none p-6"
              placeholder="Nhập nội dung bình luận..."
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleReviewSubmit}
              type="button"
              className="black-btn w-[300px] h-[50px] flex justify-center"
            >
              <span className="flex space-x-1 items-center h-full">
                <span className="text-sm font-semibold">Gửi đánh giá</span>
                {reviewSubmissionLoading && (
                  <span className="w-5" style={{ transform: "scale(0.3)" }}>
                    <LoaderStyleOne />
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
