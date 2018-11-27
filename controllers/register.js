const handleRegister = (req, res, bcrypt, db) => {
	const {name, email, password} = req.body;
	if(!email || !name || !password) {
		return res.status(400).json('incorrect form submission');	
	}

	let hash = bcrypt.hashSync(password);

	db.transaction(trx => {
		trx.insert({
			email: email,
			hash: hash
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				name: name,
				email: loginEmail[0],
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})			
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch( err  => {
		if(err.detail.includes('already exists')){
			res.status(400).json('Email is used by another user');
		}
		else{
			res.status(400).json('Unable to register user.');	
		}
	});
}




module.exports = {
	handleRegister: handleRegister
}