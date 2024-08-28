require('dotenv').config()

const express = require('express');
const path = require('path');
const app = express();

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { validateToken } = require('./service/authentication');
const Blog = require('./models/Blog'); // Ensure the correct path to your Blog model

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('mongodb connected successfully');
});
//'mongodb://localhost:27017/blogify' MONGDB URL localhost
const PORT = process.env.PORT || 8001;
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')))

function authMiddleware(req, res, next) {
    const token = req.cookies['token'];
    if (!token) {
        return res.status(401).redirect('/user/signin');
    }
    try {
        const decoded = validateToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).redirect('/user/signin');
    }
}

app.get('/', authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find().populate('createdBy'); // Fetch all blogs and populate the createdBy field
        return res.render('homepage', { user: req.user, blogs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.use('/user', userRoute);
app.use('/user', authMiddleware, blogRoute);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
