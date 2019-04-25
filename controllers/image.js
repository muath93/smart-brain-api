const Clarifai = require('clarifai');

const app = new Clarifai.App({
    // apiKey: `${process.env.CLARIFAI_API_KEY}`
    apiKey: 'f813eb77ec31488a90397d2d7e0d4d08'
});

const handelApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('Unable to work with API'))
}

const handelImage = (req, res, db) => {
    const {
        id
    } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('unable to get count!'))
}

module.exports = {
    handelImage,
    handelApiCall
}
