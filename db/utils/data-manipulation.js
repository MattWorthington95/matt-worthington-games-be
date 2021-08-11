// extract any functions you are using to manipulate your data, into this file

const formatCatData = (data) => {
  if (data.length === 0) return [];
  return data.map((cat) => {
    const catCopy = { ...cat };
    return [catCopy.slug, catCopy.description];
  });
};

const formatUserData = (data) => {
  if (data.length === 0) return [];
  return data.map((user) => {
    const userCopy = { ...user };
    return [userCopy.username, userCopy.avatar_url, userCopy.name];
  });
};

const formatReviewData = (data) => {
  if (data.length === 0) return [];
  return data.map((review) => {
    const reviewCopy = { ...review };
    return [
      reviewCopy.title,
      reviewCopy.designer,
      reviewCopy.owner,
      reviewCopy.review_img_url,
      reviewCopy.votes,
      reviewCopy.category,
      reviewCopy.owner,
      reviewCopy.created_at,
    ];
  });
};

const lookUpIdByTitle = (reviewData) => {
  if (reviewData.length === 0) return [];
  const matchedTitleAndID = {};
  const reviewDataCopy = [...reviewData];
  reviewDataCopy.forEach((review) => {
    const reviewCopy = { ...review };
    matchedTitleAndID[reviewCopy.title] = reviewCopy.review_id;
  });
  return matchedTitleAndID;
};

const formatCommentData = (commentData, titleMatchedId) => {
  if (commentData.length === 0) return [];

  const commentDataCopy = [...commentData];
  const titleMatchedIdCopy = { ...titleMatchedId };

  return commentDataCopy.map((comment) => {
    const commentCopy = { ...comment };
    // console.log(commentCopy.belongs_to, "<< belongs to");
    // console.log(titleMatchedIdCopy, "<<<< matched data");
    const review_id = titleMatchedIdCopy[commentCopy.belongs_to];
    return [
      commentCopy.created_by,
      review_id,
      commentCopy.votes,
      commentCopy.created_at,
      commentCopy.body,
    ];
  });
};
// belongs to from comment and title from review are the same

module.exports = {
  formatCatData,
  formatUserData,
  formatReviewData,
  lookUpIdByTitle,
  formatCommentData,
};
