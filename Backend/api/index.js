const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const { MongoClient } = require('mongodb');
const { Worker, Queue, QueueScheduler } = require('bullmq');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require('bcrypt');
const Stripe = require("stripe");
const LocalStrategy = require("passport-local").Strategy;
const Proposal = require('./models/proposalModel');
const Chat = require('./models/chat');
const Complaint = require('./models/complaints');
//const Message = require('./models/message');
const Contract = require('./models/contractschema');

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
const Order = require('./models/orders');
const Review = require('./models/Review');
const Payment = require('./models/paymentschema');

// const Redis = process.env.NODE_ENV === 'development' ? require('ioredis') : require('ioredis-mock');

// // Create a Redis connection
// const redisClient = new Redis();

// // Initialize BullMQ Queue and QueueScheduler
// const queue = new Queue('proposalStatusCheckQueue', {
//   limiter: {
//     max: 10, // Limit the number of concurrent jobs
//     duration: 60000, // 1 minute
//   },
//   // Define the custom storage adapter for Redis
//   settings: {
//     storeJobs: true,
//     storeJobStatus: true,
//   },
//   connection: {
//     client: redisClient, // Use the Redis client you created
//   },
// });

// const processJob = async (job) => {
//   const { proposalId } = job.data;

//   try {
//     // Find the proposal by ID (Assuming you have a Proposal model)
//     const proposal = await Proposal.findById(proposalId);

//     if (!proposal) {
//       throw new Error('Proposal not found');
//     }

//     // Calculate the time difference between now and the proposal's createdAt date
//     const currentTime = new Date();
//     const createdAt = proposal.createdAt;
//     const timeDifference = currentTime - createdAt;

//     // If the proposal is open and has been open for more than 7 days, close it
//     if (proposal.status === 'open' && timeDifference >= 7 * 24 * 60 * 60 * 1000) {
//       proposal.status = 'closed';
//       await proposal.save();
//     }

//     return `Proposal ID ${proposalId} checked and updated.`;
//   } catch (error) {
//     return `Error checking proposal ID ${proposalId}: ${error.message}`;
//   }
// };

// // Create a worker to process the jobs
// const worker = new Worker('proposalStatusCheckQueue', processJob);

// // Schedule the background task to run daily at a specific time (e.g., midnight)
// cron.schedule('0 0 * * *', async () => {
//   // Get all open proposals that need to be checked (Assuming you have a Proposal model)
//   const openProposals = await Proposal.find({ status: 'open' });

//   // Enqueue a job for each open proposal
//   openProposals.forEach((proposal) => {
//     queue.add('checkProposalStatus', { proposalId: proposal._id }, {
//       cron: '0 0 * * *', // Schedule the job to run daily at midnight
//     });
//   });
// });

// // Start the BullMQ Worker
// worker.on('completed', (job) => {
//   console.log(`Job ${job.id} completed: ${job.returnvalue}`);
// });

// worker.on('failed', (job, error) => {
//   console.error(`Job ${job.id} failed: ${error.message}`);
// });

//endpoint for registration of the user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email: email }).exec();
       const existingvendor = await Vendor.findOne({ email: email }).exec();

      if (existingUser) {
          return res.status(400).json({ message: "User with this email already exists" });
      }
       if (existingvendor) {
          return res.status(400).json({ message: "User with this email already exists" });
      }

      // If the email is not registered, create a new User object and save it to the database
      const newUser = new User({ username, email, password });
      await newUser.save();

      res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
      console.error("Error registering user", err);
      res.status(500).json({ message: "Error registering the user" });
  }
});


//vendor registration router......

app.post("/vendorregister", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      name,
      phoneNumber,
      address,
      cnic,
      province,
      city,
      category,
    } = req.body;

    // Check if the email is already registered
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

  
   // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new vendor instance
    const newVendor = new Vendor({
      username,
      email,
      password,
      name,
      phoneNumber,
      address,
      cnic,
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
console.log("hellooo");
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
    const httpPath = `/Uploads/${path.basename(filePath)}`;
  
    res.status(200).json({ message: 'File uploaded successfully', httpPath });
  });
  

  app.post("/submit-proposal/:userId", async (req, res) => {
    try {
      const { title, description, selectedCategories, budget, startDate, endDate, address, attachments, category, subCategory, subtype } = req.body;
      const loggedInUserId = req.params.userId;
  
      const newProposal = new Proposal({
        userId: loggedInUserId,
        title,
        description,
        budget,
        address,
        startDate,
        endDate,
        selectedCategories,
        attachments,
        category,
        subCategory,
        subtype,
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

  // app.get('/get-proposal/:userId', async (req, res) => {
  //   const userId = req.params.userId;
  //   const userObjectId = new mongoose.Types.ObjectId(userId);
  // //  console.log(userObjectId);
  //   try {
  //       const proposals = await Proposal.find({ userId: userObjectId });
  //     // console.log(proposals);
  //       if (!proposals || proposals.length === 0) {
  //         return res.status(404).json({ message: 'No proposals found for the user.' });
  //       }
  //       res.status(200).json(proposals);
  //     } catch (error) {
  //       console.error('Error fetching proposals:', error);
  //       res.status(500).json({ message: 'An error occurred while fetching proposals.' });
  //     }
  //   });

  app.get('/get-proposal/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);
  
    try {
      const proposals = await Proposal.find({ userId: userObjectId });
  
      if (!proposals || proposals.length === 0) {
        return res.status(404).json({ message: 'No proposals found for the user.' });
      }
  
  
      const currentDate = new Date();
  
      for (const proposal of proposals) {
        if (!proposal.address) {
          proposal.address = 'N/A'; 
        }
        
        const timeDifference = currentDate - proposal.createdAt;
  
      
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  
        if (daysDifference > 7) {
         
          proposal.status = 'closed';
         
          await proposal.save();
        }
      }
  
      res.status(200).json(proposals);
    } catch (error) {
      console.error('Error fetching and updating proposals:', error);
      res.status(500).json({ message: 'An error occurred while fetching and updating proposals.' });
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
        const currentDate = new Date();
  
        for (const proposal of matchingProposals ) {
          if (!proposal.address) {
            proposal.address = 'N/A'; 
          }
          
          const timeDifference = currentDate - proposal.createdAt;
    
        
          const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    
          if (daysDifference > 7) {
           
            proposal.status = 'closed';
           
            await proposal.save();
          }
        }
    
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


app.post('/imageupload', imageupload.array('images', 3), async (req, res) => {
  try {
    
    const imagePaths = req.files.map((file) => {
      const imageUrl = `/Uploads/${file.filename}`;
     // const imageUrl = `http://${req.hostname}/Uploads/${file.filename}`;
     // console.log(imageUrl); 
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
      name: req.body.productName,
      availability: req.body.availability,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      subCategory: req.body.subCategory,
      subtype: req.body.subtype,
      deliveryCost: req.body.deliveryCost,
      totalQuantity: req.body.totalQuantity, // Add totalQuantity field
      images: req.body.images,
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

/////compalintsrpoute.....
app.post('/complaints', async (req, res) => {
  const { userId, name, email, complaint, chatDate } = req.body;
  // console.log(userId);
  // console.log(name);
  // console.log(email);
  // console.log(complaint);
  // console.log(chatDate);

  try {
    // Parse chatDate string to create a Date object
    const chatDateObj = new Date(chatDate);

    const newComplaint = new Complaint({
      userId,
      name,
      email,
      complaint,
      chatDate: chatDateObj, // Store chatDate as a Date object
    });

    await newComplaint.save();

    res.status(201).json({ message: 'Complaint stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while storing the complaint' });
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

 
//routes for editing and updating product for vendor......


app.get('/findproduct/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Transform the image paths to URLs
    const imagesWithURLs = product.images.map((image) => {
      return `http://${req.headers.host}/fetchimage/${path.basename(image)}`;
    });

    const productWithImageURLs = {
      ...product._doc,
      images: imagesWithURLs,
    };

    return res.status(200).json({ product: productWithImageURLs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.put('/update-product/:productId', imageupload.array('images', 3), async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get the list of images associated with the product
    const productImages = product.images;

    // Update product data
    product.name = req.body.productName;
    product.availability = req.body.availability;
    product.price = req.body.price;
    product.description = req.body.description;
    product.category = req.body.category;

    // Add additional fields
    product.deliveryCost = req.body.deliveryCost;
    product.subCategory = req.body.subCategory;
    product.subtype = req.body.subtype;
    product.totalQuantity = req.body.totalQuantity;

    const newImages = req.files.map((file) => {
      const imageUrl = `/Uploads/${file.filename}`; // URL to access the uploaded image
      return imageUrl;
    });

    // Append new images to the product
    newImages.forEach((imagePath) => {
      if (!productImages.includes(imagePath)) {
        productImages.push(imagePath);
      }
    });

    // Delete existing images from the product that are not in the new list
    product.images = productImages.filter((image) => newImages.includes(image));

    // Create an array of promises to delete images
    const deletedImages = productImages.filter((image) => !newImages.includes(image));
    const deletePromises = deletedImages.map((image) => {
      const imagePath = path.join(__dirname, 'Uploads', path.basename(image));
      return fs.promises.unlink(imagePath); // Use fs.promises.unlink for async deletion
    });

    // Wait for all image deletion promises to complete
    await Promise.all(deletePromises);

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//vendor profile management.......

app.get('/get-vendor-info/:userId', async (req, res) => {
  const vendorid  = req.params.userId;
 // console.log(vendorid);
  try {
    
    const vendorInfo = await Vendor.findById(vendorid);

    if (!vendorInfo) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    console.log(vendorInfo);
    res.status(200).json({ vendor: vendorInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


///route for handling bidding......

// app.get('/proposalwithbids/:proposalId', async (req, res) => {
//   try {
//     const proposal = await Proposal.findById(req.params.proposalId).populate('bids.vendorId');
//     if (!proposal) {
//       return res.status(404).json({ message: 'Proposal not found' });
//     }
//     res.status(200).json(proposal);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


app.get('/fetchimageurls/:proposalId', async (req, res) => {
  try {
    const proposalId = req.params.proposalId;
    const selectedProposal = await Proposal.findById(proposalId); 

    if (!selectedProposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposalImageURLs = selectedProposal.attachments.map((image) => {
      return `http://${req.headers.host}/fetchimage/${path.basename(image)}`;
    });

    res.json({ imageURLs: proposalImageURLs });
  } catch (error) {
    console.error('Error fetching image URLs', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/proposalwithbids/:proposalId', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId).populate({
      path: 'bids',
      populate: {
        path: 'vendorId',
        model: 'Vendor',
      },
    });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const populatedBids = proposal.bids.map((bid) => {
      return {
        vendorId: bid.vendorId._id,
        vendorName: bid.vendorId.name, // Assuming 'vendorName' is the field in the Vendor schema
        amount: bid.amount,
        details: bid.details,
        status: bid.status,
        createdAt: bid.createdAt,
      };
    });

    res.status(200).json({
      _id: proposal._id,
      title: proposal.title,
      description: proposal.description,
      selectedCategories: proposal.selectedCategories,
      attachments: proposal.attachments,
      createdAt: proposal.createdAt,
      status: proposal.status,
      bids: populatedBids,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//deleting proposal.......
app.delete('/delete-proposal/:proposalId', async (req, res) => {
  try {
    const proposalId = req.params.proposalId;
    await Proposal.findByIdAndDelete(proposalId);
    res.status(200).json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/submit-bid', async (req, res) => {
  try {
    
    const { proposalId, vendorId, amount, details } = req.body;

    
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Create a new bid object
    const newBid = {
      vendorId,
      amount,
      details,
      status: 'pending', // Default status is "pending"
    };

    // Add the bid to the proposal's bids array
    proposal.bids.push(newBid);

    // Save the updated proposal
    await proposal.save();

    return res.status(201).json({ message: 'Bid submitted successfully', bid: newBid });
  } catch (error) {
    console.error('Error submitting bid:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



////////chats routes.....................................

app.get('/previousmessagesvendor/:vendorId/:userId', async (req, res) => {
  try {
    const { vendorId, userId } = req.params;

    // Find previous messages between the vendor and the user
    const messages = await Message.find({
      $or: [
        {
          senderId: userId,
          recipientId: vendorId,
          senderModel: 'User',
          recipientModel: 'Vendor',
        },
        {
          senderId: vendorId,
          recipientId: userId,
          senderModel: 'Vendor',
          recipientModel: 'User',
        },
      ],
    }).sort({ timestamp: 1 }); // Sort messages by timestamp in ascending order

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.get('/chats/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

  
    const chats = await Chat.find({ 'participants.user': userId });

    
    const chatData = await Promise.all(chats.map(async (chat) => {
      const participants = chat.participants.map(participant => ({
        userType: participant.userType,
        userId: participant.user,
      }));

      
      const lastMessageId = chat.messages[chat.messages.length - 1]; 
      
      const lastMessage = await Message.findById(lastMessageId);

      const vendorParticipant = chat.participants.find(participant => participant.userType === 'Vendor');
      const vendorId = vendorParticipant.user;
      const vendor = await Vendor.findById(vendorId);
      let vendorName = vendor ? vendor.name : 'Unknown Vendor';

      
      const lastMessageContent = lastMessage.message;
      const timestamp = lastMessage.timestamp;

      
      return {
        _id: chat._id,
        vendorId,
       // participants,
        vendorName,
        lastMessage: lastMessageContent,
        timestamp,
      };
    }));

    res.json(chatData);
  } catch (error) {
    console.error('Error retrieving chats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
      
});

//vendor side chats route......
app.get('/usernameget/:userId', async (req, res) => {
  try {
   // console.log(userId);
   
    const { userId } = req.params;
    
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userName: user.username }); // Adjust the property name as per your schema
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.get('/vendorsidechats/:vendorId', async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const chats = await Chat.find({ 'participants.user': vendorId, 'participants.userType': 'Vendor' });

    const chatData = await Promise.all(chats.map(async (chat) => {
      const participants = chat.participants.map(participant => ({
        userType: participant.userType,
        userId: participant.user,
      }));

      
      const lastMessageId = chat.messages[chat.messages.length - 1]; 
      const lastMessage = await Message.findById(lastMessageId);

      const userParticipant = chat.participants.find(participant => participant.userType === 'User');
      const userId = userParticipant.user;
      const user = await User.findById(userId);
      let userName = user ? user.username : 'Unknown User';

      
      const lastMessageContent = lastMessage.message;
      const timestamp = lastMessage.timestamp;

      
      return {
        _id: chat._id,
        userId,
        userName,
        lastMessage: lastMessageContent,
        timestamp,
      };
    }));

    res.json(chatData);
  } catch (error) {
    console.error('Error retrieving vendor chats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//fetching previous messages between vendor and customers...
// app.get('/previousmessages/:vendorId/:userId', async (req, res) => {
//   try {
//     const { vendorId, userId } = req.params;
//     console.log(vendorId);
//     console.log(userId);

//     // Find the chat between the vendor and the user
//     const chat = await Chat.findOne({
//       $and: [
//         {
//           'participants.user': userId,
//           'participants.userType': 'User',
//         },
//         {
//           'participants.user': vendorId,
//           'participants.userType': 'Vendor',
//         },
//       ],
//     }).populate({
//       path: 'messages',
//       populate: {
//         path: 'senderId',
//         select: 'senderModel', // Select the senderModel
//       },
//     });

//     if (!chat) {
//       return res.status(200).json({ message: 'No chat found with this vendor.' });
//     }

//     const messages = chat.messages;

//     res.json(messages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

app.get('/previousmessages/:vendorId/:userId', async (req, res) => {
  try {
    const { vendorId, userId } = req.params;

    // Find previous messages between the vendor and the user
    const messages = await Message.find({
      $or: [
        {
          senderId: userId,
          recipientId: vendorId,
          senderModel: 'User',
          recipientModel: 'Vendor',
        },
        {
          senderId: vendorId,
          recipientId: userId,
          senderModel: 'Vendor',
          recipientModel: 'User',
        },
      ],
    }).sort({ timestamp: 1 }); // Sort messages by timestamp in ascending order

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



////send messeges route....
app.post('/send-message', async (req, res) => {
  try {
    const { senderId, recipientId, senderModel, recipientModel, messageType, message, timestamp } = req.body;

    // Create a new message instance
    const newMessage = new Message({
      senderId,
      recipientId,
      senderModel,
      recipientModel,
      messageType,
      message,
      timestamp,
    });

    // Save the message to the database
    await newMessage.save();

    // Check if a chat document exists for the user and vendor
    const chat = await Chat.findOne({
      //'participants.userType': senderModel,
      $and: [
        {
          'participants.user': senderId,
          'participants.userType': senderModel,
        },
        {
          'participants.user': recipientId,
          'participants.userType': recipientModel,
        },
      ],
    });

    if (chat) {
      // Add the message to the existing chat
      chat.messages.push(newMessage._id);
      await chat.save();
      res.status(201).json({ message: 'Message sent successfully', chatId: chat._id });
    } else {
      // Create a new chat document
      const newChat = new Chat({
        participants: [
          {
            user: senderId,
            userType: senderModel,
          },
          {
            user: recipientId,
            userType: recipientModel,
          },
        ],
        messages: [newMessage._id],
      });
      const savedChat = await newChat.save();
      res.status(201).json({ message: 'Message sent successfully', chatId: savedChat._id });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});










/////vendor fetching according to each category of home page of customer...

// app.get('/vendors', async (req, res) => {
//   try {
//     // Fetch all vendors from your database
//     const allVendors = await Vendor.find();

//     if (!allVendors || allVendors.length === 0) {
//       return res.status(404).json({ error: 'No vendors found' });
//     }

//     res.json(allVendors);
//   } catch (error) {
//     console.error('Error retrieving vendors:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

/////vendor dashboard all routes.......
app.get('/vendorproducts/count/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    
    const productCount = await Product.countDocuments({ vendorId: userId });

    
    res.status(200).json({ count: productCount });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ message: 'An error occurred while counting products.' });
  }
});

app.get('/getallproducts', async (req, res) => {
  try {
    const products = await Product.find();

    const serverBaseURL = `http://${req.headers.host}`;

    const productsWithUpdatedImages = products.map((product) => {
     
      const updatedImages = product.images.map((image) => {
        return `${serverBaseURL}/fetchimage/${path.basename(image)}`;
      });

      return {
        ...product.toObject(), 
        images: updatedImages,
      };
    });

    res.status(200).json(productsWithUpdatedImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

////creating order.........
app.post('/create-order', async (req, res) => {
  try {
    const orderData = req.body;
    const order = new Order(orderData);

    
    await order.save();

    res.status(200).json({ orderId: order._id, message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Internal server error');
  }
});

//fetch all orders
app.get('/fetchallorders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch orders and sort them by creation date in descending order
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

app.get('/fetchallvendororders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ vendorId: userId }).sort({ createdAt: -1 });
    //   .populate({
    //     path: 'products',
    //     select: 'productId quantity', 
    //     populate: {
    //       path: 'productId',
    //       model: 'Product',
    //       select: 'name', 
    //     },
    //   });

    
    // const formattedOrders = orders.map((order) => {
    //   return {
    //     _id: order._id,
    //     createdAt: order.createdAt,
    //     orderStatus: order.orderStatus,
    //     paymentMethod: order.paymentMethod,
    //     Productname: order.Productname,
    //     products: order.products.map((product) => ({
    //       productName: product.productId.name,
    //       quantity: product.quantity,
    //     })),
    //     userId: order.userId,
    //     userName: order.userName,
    //     vendorId: order.vendorId,
    //     Totalpayment: order.Totalpayment,
    //   };
    // });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({ error: 'Failed to fetch vendor orders' });
  }
});

app.put('/update-order-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    
    order.orderStatus = [newStatus]; 

    await order.save();

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});


app.delete('/delete-order/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await Order.findByIdAndDelete(orderId);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete the order' });
  }
});

app.get('/checkReview/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const review = await Review.findOne({ orderId });
    res.json({ hasReview: !!review });
  } catch (error) {
    console.error('Error checking review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.post('/saveReview', async (req, res) => {
//   console.log("ghgh");
//   const { orderId, vendorId, customerId, rating, comment } = req.body;

//   try {
//     const newReview = new Review({ orderId, vendorId, customerId, rating, comment });
//     await newReview.save();

//     res.json({ success: true });
//   } catch (error) {
//     console.error('Error saving review:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.post('/saveReview', async (req, res) => {
  const { orderId, vendorId, customerId, productName,rating, comment } = req.body;

  try {
    // Find the customer by user ID
    const customer = await User.findById(customerId);
   // console.log(customer);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const newReview = new Review({
      orderId,
      vendorId,
      customerId, 
      productName,
      customerName: customer.username, 
      rating,
      comment,
    });

    await newReview.save();

    
    const reviews = await Review.find({ vendorId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    const roundedRating = averageRating.toFixed(1);

    
    await Vendor.updateOne({ _id: vendorId }, { $set: { rating: roundedRating } });

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getOrderpersonDetails/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderDetails = await Order.findById(orderId);

    if (!orderDetails) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { vendorId, userId,Totalpayment,Productname } = orderDetails;

    res.json({ vendorId, userId ,Totalpayment,Productname
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});


//payment routes........................

const stripe =Stripe('sk_test_51OHPYyKuji59BmbMFSUYiZK1RsxfiXZoNwUqgUzAfE0DLyJyEqzhmgczeeGLCZQyrDO6qcHexBGWCTsibU4gKyav00gVQKCoHx')

app.post('/stripe/pay',async (req, res) => {
 // console.log("farhan");
  try {
    const { customerName ,payment} = req.body;

    if (!customerName)
      return res.status(400).json({ message: "Please enter a name" });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: payment * 100,
      currency: "pkr",
      payment_method_types: ["card"],
      metadata: {
        name: customerName,
        
      },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post(`/webhook/stripe`,async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = await stripe.webhooks.constructEvent(
      req.body,
      sig,
      'sk_test_51OHPYyKuji59BmbMFSUYiZK1RsxfiXZoNwUqgUzAfE0DLyJyEqzhmgczeeGLCZQyrDO6qcHexBGWCTsibU4gKyav00gVQKCoHx'   );

    switch (event.type) {
      case "charge.succeeded":
        console.log('payment suceeded');

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }
  } catch (err) {
    console.error(err);
  }

  // Event when a payment is initiated
  if (event?.type === "payment_intent.created") {
    console.log(`${event.data.object.metadata.name} initated payment!`);
  }
  // Event when a payment is succeeded
  if (event?.type === "payment_intent.succeeded") {
    console.log(`${event.data.object.metadata.name} succeeded payment!`);
    //Yahan par data dalna hai

    // fulfilment
  }
  res.json({ ok: true });
});


app.get('/vendororders/count/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Assuming you have a field 'vendorId' in your Order model
    const orderCount = await Order.countDocuments({ vendorId: userId });

    res.status(200).json({ count: orderCount });
  } catch (error) {
    console.error('Error counting orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/vendorpay/count/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    const vendor = await Vendor.findById(userId);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.status(200).json({ count: vendor.payment });
  } catch (error) {
    console.error('Error getting vendor payment count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/savePayment', async (req, res) => {
  try {
    const { orderId, vendorId, customerId, payment } = req.body;

    console.log(orderId);
    console.log(vendorId);
    console.log(customerId);
    console.log(payment);
    

    
    const currentDate = new Date();

    
    const newPayment = new Payment({
      orderId: orderId,
      vendorId: vendorId,
      customerId: customerId,
      payment: payment,
      timeCreation: currentDate,
    });

    
    await newPayment.save();

    res.status(201).json({ message: 'Payment saved successfully' });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/updateVendorPayment', async (req, res) => {
  try {
    const { vendorId, totalPayment } = req.body;

    
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

   
    vendor.payment += totalPayment;

    
    await vendor.save();

    res.status(200).json({ message: 'Vendor payment updated successfully' });
  } catch (error) {
    console.error('Error updating vendor payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/vendorproposaldetails/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;

   
    const vendor = await Vendor.findById(vendorId);
    const rating = vendor ? vendor.rating : 0;

    const totalOrders = await Order.countDocuments({ vendorId });

    
    const allReviews = await Review.find({ vendorId });

    
    const formattedReviews = allReviews.map(({ customerName,productName, rating, comment, timestamp }) => ({
      customerName,
      productName,
      rating,
      comment,
      timestamp,
    }));

    res.json({ totalOrders, rating, reviews: formattedReviews });
  } catch (error) {
    console.error('Error fetching vendor details', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/accept-bid/:proposalId/:vendorId', async (req, res) => {
  try {
    const { proposalId, vendorId } = req.params;

   
    const proposal = await Proposal.findById(proposalId);

   
    proposal.bids.forEach((bid) => {
      if (bid.vendorId.toString() === vendorId) {
        bid.status = 'accepted';
      } else {
        bid.status = 'rejected';
      }
    });

    
    await proposal.save();

    res.status(200).json({ message: 'Bid accepted successfully' });
  } catch (error) {
    console.error('Error accepting bid', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/proposalacceptedbid/:proposalId', async (req, res) => {
  const proposalId = req.params.proposalId;

  try {
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const acceptedBid = proposal.bids.find((bid) => bid.status === 'accepted');

    if (!acceptedBid) {
      return res.status(404).json({ error: 'Accepted bid not found for the proposal' });
    }

   
    const vendor = await Vendor.findById(acceptedBid.vendorId);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found for the accepted bid' });
    }

    
    const vendorInfo = {
      vendorName: vendor.name,
      address: vendor.address,
      city: vendor.city,
    };

    // Construct the response object
    const response = {
      vendorInfo,
      bidInfo: {
        amount: acceptedBid.amount,
        details: acceptedBid.details,
      },
    };
   // console.log(response);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching bid details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



const paymentProofStorage = multer.diskStorage({
 
  destination: (req, file, cb) => {
    const uploadsFolderPath = path.join(__dirname, 'Uploads'); 
    cb(null, uploadsFolderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${ext}`);
  },
});

const paymentProofUpload = multer({ storage: paymentProofStorage });

app.post('/paymentproofupload', paymentProofUpload.single('proofOfPayment'), async (req, res) => {
  try {
  //  console.log("hii");
    const imageUrl = `/Uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/savecontract', async (req, res) => {
 // console.log("contract route");
  try {
    
    const {
      vendorId,
      userId,
      userBankAccountHolder,
      userBankAccountNumber,
      adminFee,
      totalBidAmount,
      proposalDetails,
      proofOfPaymentUrl,
    } = req.body;

    // Create a new contract instance
    const newContract = new Contract({
      vendorId,
      userId,
      userBankAccountHolder,
      userBankAccountNumber,
      proofOfPaymentUrl,
      adminFee,
      totalBidAmount,
      proposalDetails,
      contractStatus: 'pending',
      createdAt: Date.now(),
      
    });

    
    const savedContract = await newContract.save();

    res.status(201).json(savedContract);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/fetchingcustomercontracts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    
    const contracts = await Contract.find({ userId });

    res.status(200).json(contracts);
  } catch (error) {
    console.error('Error retrieving contracts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/////webroutes
app.get('/webget-vendor', async (req, res) => {
  try {
    console.log("hello");
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/webupdatestatus/:id', async (req, res) => {
  const vendorId = req.params.id;
  let { accountstatus } = req.body;

  // Check if accountstatus is not initialized, initialize it and set the status to suspended
  if (!accountstatus) {
    accountstatus = 'suspended';
  }

  try {
    // Find the vendor by ID and update the accountstatus
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { accountstatus },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor account status updated successfully' });
  } catch (error) {
    console.error('Error updating vendor account status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/webgetcontracts', async (req, res) => {
  try {
    const contracts = await Contract.find();

    
    const contractsWithImageLinks = contracts.map(contract => {
      return {
        ...contract._doc,
        proofOfPaymentUrl: contract.proofOfPaymentUrl
          ? `http://${req.headers.host}/fetchimage/${path.basename(contract.proofOfPaymentUrl)}`
          : null,
      };
    });
    

    res.json(contractsWithImageLinks);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get count of all vendors
app.get('/weballvendors', async (req, res) => {
  try {
    const vendorsCount = await Vendor.countDocuments();
    res.json({ count: vendorsCount });
  } catch (error) {
    console.error('Error counting vendors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get count of all customers
app.get('/weballcustomers', async (req, res) => {
  try {
    const customersCount = await Customer.countDocuments();
    res.json({ count: customersCount });
  } catch (error) {
    console.error('Error counting customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/updatecontractstatus/:contractId', async (req, res) => {
  const { contractId } = req.params;
  const { contractStatus, rejectionComment } = req.body;
  console.log(rejectionComment);

  try {
    // Find the contract by ID
    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Update contract status
    contract.contractStatus = contractStatus;
      contract.comment = rejectionComment;

    
    await contract.save();

    res.json({ message: 'Contract updated successfully' });
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/approvecontract/:contractId', async (req, res) => {
  const { contractId } = req.params;

  try {
    
    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    
    contract.contractStatus = 'approved';

    await contract.save();

    res.json({ message: 'Contract approved successfully' });
  } catch (error) {
    console.error('Error approving contract:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/webgetcomplaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a complaint with admin feedback
app.put('/webupdatecomplaint/:complaintId', async (req, res) => {
  const { complaintId } = req.params;
  const { adminComment } = req.body;

  try {
    
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

   
    complaint.admincomment = adminComment;

   
    await complaint.save();

    res.json({ message: 'Complaint updated successfully' });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-paymentnot/:userId', async (req, res) => {
  try {
    const customerId  = req.params.userId;
  
    const payments = await Payment.find({ customerId }).sort({ timeCreation: -1 }).populate( 
    {
    path: 'orderId',
    model: 'Order',
    select: 'Productname',
    }
    );

   
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-complaintsnot/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const complaints = await Complaint.find({ userId });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});