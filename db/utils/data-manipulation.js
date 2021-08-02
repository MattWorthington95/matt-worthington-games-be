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
            user.username,
            user.avatar_url,
            user.name
        ]
    })
}

const formatReviewData = (data) => {

}

module.exports = { formatCatData, formatUserData, formatReviewData }
