const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/Blog.js'); // Adjust the path if necessary
const Comment = require('../models/Comment.js'); // Adjust the path if necessary

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads")); 
    },
    filename: function (req, file, cb) {
        const filename =`${Date.now()}-${file.originalname}`
        cb(null,filename);
    }
}); 

const upload = multer({ storage: storage });


router.get('/add-new', (req, res) => {
    res.render('addBlog', { user: req.user }); 
});


router.post('/add-new', upload.single('coverImage'), async (req, res) => {
    console.log(req.body);
    try {
        const { title, body } = req.body;
        const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : ''; // Assuming uploads are stored in 'uploads/' directory

        const newBlog = new Blog({
            title,
            body,
            coverImageUrl,
            createdBy: req.user._id // Assuming you have authentication middleware setting req.user
        });

        await newBlog.save();
        res.redirect('/'); // Redirect to homepage or wherever after successful blog creation
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/:id',async (req,res) => {
    const blog= await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId:req.params.id}).populate("createdBy");
    console.log(comments)
    res.render('blog',
    {
        user:req.user,
        blog,
        comments
    }
    );

})

router.post('/comment/:blogId',async (req,res) => {
    const comment = await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    })
    return res.redirect(`/user/${req.params.blogId}`);
});


router.post('/delete/:id',async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ msg: 'Blog not found' });


        if (blog.createdBy.toString() !== req.user._id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

       
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;


module.exports = router;
