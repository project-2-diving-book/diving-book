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
		placesToEat: {
			type: String,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const Dive = model("Dive", diveSchema);
