var express = require('express'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	util = require('util'),
    // http = require('http'),
    //Promise = require('promise'),
	path = require('path'),
	application_root = __dirname;

// var app = express.createServer(); deprecated
var app = express(); 


// Database 

mongoose.connect('mongodb://localhost/vicon');

// Config
app.configure(function(){
	// app.use(express.bodyParser()); Soon to be deprecated in Connect 3.0
	// app.use(express.json()).use(express.urlencoded());
	app.use(express.bodyParser({
		keepExtensions: true,
		uploadDir: './uploads'
	}));
	app.use(express.methodOverride());
	
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-File-Name, Content-Type, X-HTTP-Method-Override, Cache-Control");
	  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
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
	name : { type: String }
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

// Upload images
app.post('/api/products/uploadImages', function(req, res) {

	if (!req.files) return;
	
	var files = req.files,
		keys = Object.keys(files),
		getExtension = function(type) {

			switch(type) {
				case 'image/jpeg': return '.jpg';
				case 'image/png': return '.png';
				case 'image/gif': return '.gif';
				default: return '';
			}

		};
	
		var cache = {};

	var readAsync = function(file, newPath, cb) {
		
		console.log('file read : ');
		console.log(file);

		fs.readFile(file, function(err, data) {
			
			if (err) {
				console.log('error reading the file');
				return res.send(500, "Error reading image file.");
			} else {
				console.log('done reading file ' + file);
				cb(file, newPath);
					
			}
		});
	};

	var renameAsync = function(oldPath, newPath) {

		fs.rename(oldPath, newPath, function(err){
			if (err) {
				console.log('error writing file');
				return res.send(500, "Error renaming image file.");
			} else {
				console.log('success writing file ' + newPath);
			}
		});
	}
	
	for(var i = 0, l = keys.length; i < l ; i ++) {
		var current = keys[i],
			extension = getExtension(files[current].headers['content-type']),
			imgName = current.substr(5, current.length) + extension,
			newPath = application_root + "/uploads/" + imgName;

			readAsync(files[current].path, newPath, renameAsync);
	}

	//res.send('Done reading files');
	return res.send(200, { success: 'Done uploading files.'});
	
});

app.get('/api/products/images/:id/:kind', function(req, res) {
	var productId = req.params.id,
		kind = req.params.kind,
		img = fs.readFileSync(application_root + "/uploads/" + productId + "_" + kind + ".jpg");

		res.writeHead(200, {'Content-Type': 'image/jpg' });
		res.end(img, 'binary');

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
		product.name = req.body.name;
		product.brand = req.body.brand;
		product.categories = req.body.categories;
		product.categories = req.body.categories;
		product.images = req.body.images;
		product.variants = req.body.variants;

		// console.log("Product : ");
		// console.dir(product);

		// return null;
		res.set('Content-Type', 'application/json');

		return product.save(function(err) {

			if(!err) {
				return res.send(200, { success: 'Product was updated successfully.'});
			} else {
				console.log(err);
				return res.send(500, { error: 'Could not update the product.' });
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
				return res.send(200, 'Product deleted.');
			} else {
				console.log(err);
				return res.send(500, "Error removing product.");
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
