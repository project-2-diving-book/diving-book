/** @format */

const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
	{
		username: {
			type: String,
			required: false,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		divingLevel: {
			type: String,
			enum: [
				"Begginer",
				"Open Water Diver",
				"Advanced Open Water Diver",
				"Resque Diver",
				"Divemaster",
				"Instructor",
			],
		},
		imgProfile: {
			type: String,
		},
		DivesToDo: [
			{
				type: Schema.Types.ObjectId,
				ref: "Dive",
			},
		],
		
	},
	{
		// this second object adds extra properties: `createdAt` and `updatedAt`
		timestamps: true,
	}
);

const User = model("User", userSchema);

module.exports = User;
