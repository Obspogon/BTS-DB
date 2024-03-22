var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var listingSchema = new mongoose.Schema(
	{
		name: { type: String, required: [true, "Name is required"] },
		price: {
			type: Number,
			required: [true, "Price is required"],
			validate: {
				validator: function (value) {
					return value >= 0;
				},
				message: () => "Please enter a valid price",
			},
		},
		description: { type: String, required: [true, "Description is required"] },
		dateposted: { type: Date, default: Date.now, required: true },
		images: [String],
		location: { type: String, required: [true, "Location is required"] },
	},
	{ collection: "Listings" }
);
module.exports = mongoose.model("Listing", listingSchema);
