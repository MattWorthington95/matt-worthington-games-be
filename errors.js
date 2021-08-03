const handleRouter404s = (req, res, next) => {
    res.status(404).send({ message: 'Path does not exist' })
}

const handleCustomErrors = (err, req, res, next) => {
    res.status(400).send({ message: err.message })
}

module.exports = { handleRouter404s, handleCustomErrors }