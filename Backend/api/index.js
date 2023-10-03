const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

const uri = "mongodb://127.0.0.1:27017/constructionease";

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to Mongo Db");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDb", err);
    });

app.listen(port, () => {
    console.log("Server running on port 8000");
});

const User = require("./models/user");
const Vendor = require('./models/Vendor');
const Message = require("./models/message");

//endpoint for registration of the user

app.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    // create a new User object
    const newUser = new User({ username, email, password });

    // save the user to the database
    newUser
        .save()
        .then(() => {
            res.status(200).json({ message: "User registered successfully" });
        })
        .catch((err) => {
            console.log("Error registering user", err);
            res.status(500).json({ message: "Error registering the user!" });
        });
});

//vendor registration router......

app.post("/vendorregister", async (req, res) => {
    try {
    const {
      username,
      email,
      password,
      name,
      cnic,
      phoneNumber,
      address,
      province,
      city,
      category,
    } = req.body;

    // Check if the email is already registered
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create a new vendor instance
    const newVendor = new Vendor({
      username,
      email,
      password, // You should hash the password before saving it
      name,
      cnic,
      phoneNumber,
      address,
      province,
      city,
      category,
    });

    // Save the vendor to the database
    await newVendor.save();

    res.status(201).json({ message: 'Vendor registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//function to create a token for the user
const createToken = (userId) => {
    // Set the token payload
    const payload = {
        userId: userId,
    };

    // Generate the token with a secret key and expiration time
    const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

    return token;
};

//endpoint for logging in of that particular user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists in the User database
  User.findOne({ email })
      .then((user) => {
          if (!user) {
              // If not found in the User database, check in the Vendor database
              Vendor.findOne({ email })
                  .then((vendor) => {
                      if (!vendor) {
                          // Email not found in either database
                          return res.status(404).json({ message: "User or Vendor not found" });
                      }

                      // Compare the provided password with the vendor's hashed password
                      if (vendor.password !== password) {
                          return res.status(401).json({ message: "Invalid Password!" });
                      }

                      // Generate and return a JWT for the vendor
                      const token = createToken(vendor._id);
                      res.status(200).json({ token, userType: "Vendor" });
                  })
                  .catch((error) => {
                      console.log("error in finding the vendor", error);
                      res.status(500).json({ message: "Internal server Error!" });
                  });
          } else {
              // Compare the provided password with the user's hashed password
              if (user.password !== password) {
                  return res.status(401).json({ message: "Invalid Password!" });
              }

              // Generate and return a JWT for the user
              const token = createToken(user._id);
              res.status(200).json({ token, userType: "User" });
          }
      })
      .catch((error) => {
          console.log("error in finding the user", error);
          res.status(500).json({ message: "Internal server Error!" });
      });
});

//endpoint to access all the users except the user who's is currently logged in!

app.get("/users/:userId", (req, res) => {
  // console.log("hello");
    const loggedInUserId = req.params.userId;
  
    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.log("Error retrieving users", err);
        res.status(500).json({ message: "Error retrieving users" });
      });
  });

  //route for creating new proposal requests.........

const storage = multer.diskStorage({
  
  destination: (req, file, cb) => {
   // const uploadsFolderPath = path.join(__dirname, '..', 'Backend', 'api', 'Uploads');
    const uploadsFolderPath = path.join(__dirname, 'Uploads');
    cb(null, uploadsFolderPath);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

  // Handle file uploads
  app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file received' });
    }
  
    const filePath = req.file.path; // Get the path to the saved file
  
    res.status(200).json({ message: 'File uploaded successfully', filePath });
  });
  




  const Proposal = require('./models/proposalModel');


  app.post("/submit-proposal/:userId", async (req, res) => {
    try {
      const { title, description, selectedCategories } = req.body;
      const loggedInUserId = req.params.userId;
      const attachments = req.body.attachments || [];
      //const userId = req.user.id;
      //console.log(userId);
      // Create a new proposal instance
      const newProposal = new Proposal({
        userId:loggedInUserId,
        title,
        description,
        selectedCategories,
        attachments,
      });
  
      // Save the proposal to the database
      const savedProposal = await newProposal.save();
  
      res.status(200).json(savedProposal);
    } catch (error) {
      console.error('Error submitting proposal:', error);
      res.status(500).json({ message: 'An error occurred while submitting the proposal.' });
    }
  });


  // getting all proposals created by loggedin user..........

  app.get('/get-proposal/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);
  //  console.log(userObjectId);
    try {
        const proposals = await Proposal.find({ userId: userObjectId });
      // console.log(proposals);
        if (!proposals || proposals.length === 0) {
          return res.status(404).json({ message: 'No proposals found for the user.' });
        }
        res.status(200).json(proposals);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        res.status(500).json({ message: 'An error occurred while fetching proposals.' });
      }
    });

    //getting all proposal to vendor................

    app.get('/get-vendor-category/:userId',  async (req, res) => {
      const userId = req.params.userId;
     // console.log(userId);
      try {
        const user = await Vendor.findById(userId);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Assuming the user has a field 'category' that represents the vendor's category
        const vendorCategory = user.category;
      //  console.log(vendorCategory);
        res.status(200).json({ vendorcategory: vendorCategory });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    });


    app.get('/get-matching-proposals/:vendorCategory',  async (req, res) => {
      
      const vendorCategory = req.params.vendorCategory;
    
      try {
        
    
        // Fetch proposals matching the vendor's category
        const matchingProposals = await Proposal.find({ selectedCategories: { $in: [vendorCategory] } });
    
        res.status(200).json(matchingProposals);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // Define a route to fetch the user's name based on their ID
app.get('/vendorname/:userId', async (req, res) => {
  const userId = req.params.userId;
  //console.log(userId);
  

  try {
    
    const vendor = await Vendor.findOne({ _id: userId });

    if (!vendor) {
   
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json({ userName: vendor.username });
   // console.log(vendor.username);
  } catch (error) {
    
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

 ////fetching all product that vendor uploaded.........
 const Product = require('./models/Product');

 //fetching images of products....
 app.use('/fetchimage', express.static(path.join(__dirname, 'Uploads')));
 

 app.get('/products/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const products = await Product.find({ vendorId: userId });

    // Replace local image paths with URLs
    const productsWithImageURLs = products.map((product) => {
      const imagesWithURLs = product.images.map((image) => {
        return `http://${req.headers.host}/fetchimage/${path.basename(image)}`;
      });

      return {
        ...product._doc,
        images: imagesWithURLs,
      };
    });

    res.status(200).json({ products: productsWithImageURLs });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//routes for Add Product.........

// Set up multer for image uploads
const imagestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsFolderPath = path.join(__dirname, 'Uploads'); // Store images in public/uploads directory
    cb(null, uploadsFolderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${ext}`);
  },
});

const imageupload = multer({ storage: imagestorage });

// Define an endpoint for uploading images
app.post('/imageupload', imageupload.array('images', 3), async (req, res) => {
  try {
    // Assuming req.files contains the uploaded files
    const imagePaths = req.files.map((file) => {
      const imageUrl = `/Uploads/${file.filename}`; // URL to access the uploaded image
      return imageUrl;
    });
    res.json({ imagePaths });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define an endpoint for handling product submissions
app.post('/submit-product/:userId', async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    // Create a new product document
    const product = new Product({
      vendorId: loggedInUserId,
      name: req.body.productName, // Update field name to 'name'
      availability: req.body.availability,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      images: req.body.images, // Assuming req.body.images contains image URLs
      // Add other fields as needed based on your schema
    });

    // Save the product to the database
    await product.save();

    res.json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

///router for deleting product......

app.delete('/deleteproducts/:_id', async (req, res) => {
  const productId = req.params._id;

  try {
    // Find the product by its ID
    const product = await Product.findById(productId);
   // console.log(product);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated images from the Uploads folder
    product.images.forEach(async (image) => {
      const imagePath = path.join(__dirname, 'Uploads', path.basename(image));
      fs.unlinkSync(imagePath); 
    });
    await Product.deleteOne({ _id: productId });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Set up multer for image uploads
// const imagestorage = multer.diskStorage({
//  // destination: 'Uploads/', 
//  destination: (req, file, cb) => {
//    const uploadsFolderPath = path.join(__dirname, 'Uploads');
//    cb(null, uploadsFolderPath);
//  },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = file.originalname.split('.').pop();
//     cb(null, `${uniqueSuffix}.${ext}`);
//   },
// });

// const imageupload = multer({ storage: imagestorage });

// // Define an endpoint for uploading images
// app.post('/imageupload', imageupload.array('images', 3), async (req, res) => {
//   try {
//     // Assuming req.files contains the uploaded files
//     const imagePaths = req.files.map((file) => file.path);
//     res.json({ imagePaths });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Define an endpoint for handling product submissions
// app.post('/submit-product/:userId', async (req, res) => {
//   try {
//     const loggedInUserId = req.params.userId;
//     // Create a new product document
//     const product = new Product({
//       vendorId:loggedInUserId,
//       name: req.body.productName, // Update field name to 'name'
//       availability: req.body.availability,
//       price: req.body.price,
//       description: req.body.description,
//       category: req.body.category,
//       images: req.body.images,
//       // Add other fields as needed based on your schema
//     });

//     // Save the product to the database
//     await product.save();

//     res.json({ message: 'Product added successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

 

