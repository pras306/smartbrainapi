const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '151f5c39e83f4958bcd1b0875cf0e69a'
});

const handleApiCall = (req, res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(err => res.status(400).json('Unable to handle API call.'));
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users')
	.where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		if(entries.length > 0){
			res.json(entries[0]);
		}
		else{
			res.status(400).json('User not found');
		}
	})
	.catch(err => res.status(400).json('Unable to retrieve user entry count.'));	
}


module.exports = {
	handleImage,
	handleApiCall
}