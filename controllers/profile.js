const handleProfileGet = (req, res, db) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
	.then(user => {
		if(user.length > 0){
			res.json(user[0]);
		}
		else{
			res.status(400).json('User not found');
		}
	})
	.catch(err => res.status(400).json('Unable to get user details.'));
}


module.exports = {
	handleProfileGet
}