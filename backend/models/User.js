//User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
	username: {
		type: String,
		required: true, // username is a required field
		unique: true,   // username must be unique
		trim: true      // whitespace around the string will be removed
	},
	displayName: {
		type: String,
		trim: true,
		maxlength: 50,
		default: ""
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	bio: {
		type: String,
		maxlength: 200,
		default: ""
	},
	passwordHash: {
		type: String,
		required: true,
	},
	favoriteMovies: [String],
	friendsList: [{ type: Schema.Types.ObjectId, ref: "User" }]
},
	{ timestamps: true },);

const User = mongoose.model('User', userSchema);

module.exports = User;