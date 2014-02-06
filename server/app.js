var express = require('express'),
	mongoose = require('mongoose'),
    // http = require('http'),
	path = require('path'),
	application_root = __dirname;

// var app = express.createServer(); deprecated
var app = express(); 


// Database 

mongoose.connect('mongodb://localhost/vicon');

// Config

app.configure(function(){
	// app.use(express.bodyParser()); Soon to be deprecated in Connect 3.0
	app.use(express.urlencoded());
	app.use(express.json());
	app.use(express.methodOverride());
	
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	  res.header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
	  next();
	});

	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Schema = mongoose.Schema;

// Category Schema
var CategorySchema = new Schema({
	name: { type: String, required: true}
});

// Image Schema
var ImageSchema = new Schema({
	kind : { type: String, required: true },
	url : { type: String }
});

var SizeSchema = new Schema({
	size: {type: String, default: "unit" },
	sku: { type: String }
});

// Product variant schema
var VariantSchema = new Schema({
	color: {type: String, default: "N/A" },
	images : [
		ImageSchema
	],
	sizes : [
		SizeSchema
	]
})


// Main Product schema
var ProductSchema = new Schema({
	// _id: { type: String, unique: true},
	name : { type: String, required: true },
	brand : { type: String, required: true},
	categories : [
		CategorySchema
	],
	images : [
		ImageSchema
	],
	variants : [
		VariantSchema
	],
	modified : {type: Date, default: Date.now }
});


var ProductModel = mongoose.model('Product', ProductSchema);

app.get('/api', function(req, res){
	res.send('Vicon API is running');
});


// READ a list of products
app.get('/api/products', function(req, res){
	return ProductModel.find(function(err, products) {
		if (!err) {
			return res.send(products);
		} else {
			console.log(err);
			return null;
		}
	});
});

// Create a single product
app.post('/api/products', function(req, res) {
	var product;
	console.log('POST: ');
	console.log(req.body);

	product = new ProductModel({
		name : req.body.name,
		brand : req.body.brand,
		categories : req.body.categories,
		images : req.body.images,
		variants : req.body.variants
	});

	product.save(function(err){
		if(!err){
			console.log("created");
			return res.send(200, 'Product Saved.');
		} else {
			console.log("Error saving the product : " + err);
			return res.send(500);
		}
	});
	return res.send(product);
});

app.post('/api/products/bulk', function(req, res) {
	var i, len = 0;
		console.log('is Array req.body.products');
		console.log('POST: (products)');
		console.log(req.body.products);

		if(Array.isArray(req.body.products)) {
			len = req.body.products.length;
			
			var products = req.body.products;
			
			ProductModel.create(products, function(err){
				if(!err) {
					console.log("bulk inserting products is done. Affected: " + len);
				} else {
					console.log(err);
				}
			});
		}

		// for (i = 0; i < len; i++) {
		// 	console.log("CREATE product by id:");
		// 	var product = req.body.products[i];

		// 	for (var id in product) {
		// 		console.log(id);
		// 	}

		// 	// ProductModel.create(product, function(err, ){

		// 	// });
		// }

		return res.send(req.body.products);

});

// Read a single product by Id
app.get('/api/products/:_id', function(req, res) {
	return ProductModel.findById(req.params._id, function (err, product) {
		if (!err) {
			return res.send(product);
		} else {
			console.log(err);
			return res.send(null);
		}
	});
});

// Update a single product by id
app.put('/api/products/:_id', function(req, res) {
	return ProductModel.findById(req.params._id, function (err, product) {
		product.title = req.body.title;
		product.description = req.body.description;
		product.id = req.body.id;
		product.categories = req.body.categories;
		product.images = req.body.images;

		return product.save(function(err) {
			if(!err) {
				console.log("updated");
			} else {
				console.log(err);
			}
		});
		
		return res.send(product);

	});
});


// Delete a single product by ID 
app.del('/api/products/:_id', function(req, res) {
	return ProductModel.findById(req.params._id, function (err, product){
		return product.remove(function (err){
			if(!err) {
				console.log('removed');
				return res.send('');
			} else {
				console.log(err);
			}
		});
	});
});


// var enableCORS = function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

// 	// intercept OPTIONS method
// 	if('OPTIONS' == req.method) {
// 		res.send(200);
// 	} else {
// 		next();
// 	}
// };



// enable CORS !
// app.use(enableCORS);

app.listen(4242);
