var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema(
	{
		email: { type: String, required: [true, "Email is required"] },
		password: { type: String, required: [true, "Password is required"] },
		phone: { type: String },
		orderhistory: [String],
		paymentinfo: {
			cardnumber: { type: String },
			CCV: { type: String },
			cardexpiry: { type: String },
		},
		listeditems: [String],
	},
	{ collection: "Users" }
);
module.exports = mongoose.model("User", userSchema);
