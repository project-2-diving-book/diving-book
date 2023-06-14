/** @format */

const { Schema, model } = require("mongoose");

const diveSchema = new Schema(
	{
		divingSite: {
			type: String,
			required: true,
		},
		depth: {
			type: Number,
			required: true,
			min: 0,
		},
		duration: {
			type: Number,
			required: true,
			min: 0,
		},
		buddy: {
			type: String,
		},
		//image
		imgDive: {
			type: String,
			default:
				"https://res.cloudinary.com/dcslof4ax/image/upload/v1686592088/user-folder/wxjsptzx8l5kplnay3wn.png",
		},

		placesToEat: {
			type: String,
		},
		comments: {
			type: String,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		coords: {
			type: Object,
		},
	},
	{
		timestamps: true,
	}
);

const Dive = model("Dive", diveSchema);

module.exports = Dive;
