const TrashItem = require('../../models/admin/trashBin');
const BlogPost = require('../../models/admin/blog'); // Assuming you have a model for your blog post

exports.addposts = async (req, res) => {
  try {
    const { posttitle, description, content, tags, author ,subCategories, category, } = req.body;
    let cover = ''; // Initialize brandImage as an empty string
    
    if (req.files) {
      // If a file was uploaded, push an object with img property to the cover array
      cover = req.files.map(file => {
        return {
          img: `/public/${file.filename}`
        }
      });
    }
    const newPost = new BlogPost({
      posttitle,
      description,
      content,
      cover,
      tags,
      author,
      subCategories,
      category,
    });

    // Check if there is an uploaded file
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all blog posts
exports.getposts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().sort({ updatedAt: -1 }); // Sort by createdAt in descending order
    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single blog post by ID
exports.getpost = async (req, res) => {
  const postId = req.params.id;
  try {
    const blogPost = await BlogPost.findById(postId); // Change 'id' to 'postId'
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update a blog post by ID 
exports.putPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedData = req.body;
    // Check if there's an uploaded file for the cover image
    if (req.files && req.files.length > 0) {
      // Assuming 'cover' is the field in your model for storing the array of cover images
      updatedData.cover = req.files.map(file => {
        return {
          img: `/public/${file.filename}`
        };
      });
    }
    const updatedPost = await BlogPost.findByIdAndUpdate(postId, updatedData, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the blog post by ID
    const deletedPost = await BlogPost.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Construct the object with necessary fields
    const trashItemObject = {
      _id: deletedPost._id,
      posttitle: deletedPost.posttitle,
      description: deletedPost.description,
      content: deletedPost.content,
      cover: deletedPost.cover,
      tags: deletedPost.tags,
      comments: deletedPost.comments,
      likes:deletedPost.likes,
      author: deletedPost.author,
      subCategories:deletedPost.subCategories,
      category:deletedPost.category,
      // Add other fields as needed
    };

    // Path of the deleted item (modify this based on your application structure)
    const deletedPath = `/blog/${postId}`;

    // Create a new TrashItem
    const trashItem = new TrashItem({
      original: [trashItemObject],
      deletedPath: deletedPath,
      dataFrom:`Blog`
    });

    // Save the new TrashItem
    await trashItem.save();

    res.json({ message: "Blog post moved to trash bin successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getPostsBySubcategories = async (req, res) => {
  try {
    const { subCategoryName } = req.params; // Change from req.body to req.params

    // Find blog posts with the specified subcategories
    const blogPosts = await BlogPost.find({ subCategories: subCategoryName })
      .sort({ updatedAt: -1 });

    res.json({ subCategoryName, blogPosts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get blog posts by category

exports.getPostsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Find blog posts with the specified category
    const blogPosts = await BlogPost.find({ category: categoryName })
      .sort({ updatedAt: -1 });

    res.json({ categoryName, blogPosts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};