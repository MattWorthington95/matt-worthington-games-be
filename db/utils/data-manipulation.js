// extract any functions you are using to manipulate your data, into this file

const formatCatData = (data) => {
    if (data.length === 0) return []
    return data.map(cat => {
        const catCopy = { ...cat }
        return [
            catCopy.slug,
            catCopy.description
        ]
    })
}

const formatUserData = (data) => {
    if (data.length === 0) return []
    return data.map(user => {
        const userCopy = { ...user }
        return [
            userCopy.username,
            userCopy.avatar_url,
            userCopy.name
        ]
    })
}

const formatReviewData = (data) => {
    if (data.length === 0) return []
    return data.map(review => {
        const reviewCopy = { ...review }
        return [
            reviewCopy.title,
            reviewCopy.designer,
            reviewCopy.owner,
            reviewCopy.review_img_url,
            reviewCopy.votes,
            reviewCopy.category,
            reviewCopy.owner,
            reviewCopy.created_at
        ]
    })
}

const titleToMatchID = (reviewData) => {
    if (reviewData.length === 0) return []
    const matchedTitleAndID = {}
    const reviewDataCopy = [...reviewData]
    reviewDataCopy.forEach(review => {
        const reviewCopy = { ...review }
        matchedTitleAndID[reviewCopy.title] = reviewCopy.review_id
    })
    return matchedTitleAndID
}

module.exports = { formatCatData, formatUserData, formatReviewData, titleToMatchID }
