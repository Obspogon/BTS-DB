const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const multer = require("multer");
app.use(bodyParser.urlencoded({ extended: false }));

// connect to the MongoDB
mongoose
	.connect(process.env.MONGODB_URI, { dbName: "Main" })
	.then(async () => {
		console.log("Connected to MongoDB database");
	})
	.catch((err) => {
		console.log("Database connection failed");
		console.log(err);
		process.exit(1);
	});

const userSchema = new mongoose.Schema(
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
const userModel = mongoose.model("User", userSchema);

const listingSchema = new mongoose.Schema(
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
const Listing = mongoose.model("Listing", listingSchema);

// Set up multer
// Create the multer instance
const upload = multer({ dest: "./images/" });

app.get("/", function (req, res) {
	res.send("Hello World");
});

app.get("/users", async function (req, res) {
	//get all users
	userModel
		.find({})
		.then((data) => {
			console.log(data);
		})
		.catch((err) => {
			console.log(err);
		});

	// let user = new User({
	// 	email: "test",
	// 	password: "test",
	// 	phone: "test",
	// 	orderhistory: ["String"],
	// 	paymentinfo: {
	// 		cardnumber: "String",
	// 		CCV: "String",
	// 		cardexpiry: "String",
	// 	},
	// 	listeditems: ["String"],
	// });
	// user.save()
	// 	.then(() => {
	// 		console.log("User created successfully");
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 	});

	return res.status(200).send("Users");
});

app.get("/listings", async function (req, res) {
	//get all listings
	Listing.find({})
		.then((data) => {
			console.log(data);
		})
		.catch((err) => {
			console.log(err);
		});

	return res.status(200).sendFile(path.join(__dirname, "/listings.html"));
});

app.post("/listings", upload.array("images"), function (req, res) {
	console.log("New Listing:");
	console.log(req.body);
	console.log("Images:");
	console.log(req.files);

	//validate that all the data is there and correct
	if (req.body.name === null || req.body.price === null || req.body.description === null || req.body.location === null) {
		res.send("Error: One or more of your required fields is missing.");
		return -1;
	}
	if (req.body.price < 0) {
		res.send("Error: Price must be a positive number.");
		return -1;
	}

	let imagepaths = [];

	//create array of image names
	for (let i = 0; i < req.files.length; i++) {
		imagepaths.push(`images/listings/${req.files[i].originalname}`);
	}

	//add to database
	const newlisting = new Listing({
		name: req.body.name,
		price: req.body.price,
		description: req.body.description,
		images: imagepaths,
		location: req.body.location,
	});
	newlisting
		.save()
		.then(function (doc) {
			console.log(doc._id.toString());
			res.status(200).send("Listing posted");
		})
		.catch(function (error) {
			console.log(error);
			res.send("Error adding listing to database: See console");
		});
});

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});
