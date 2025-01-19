const {Schema ,model }= require('mongoose');
const { schema } = require('./User.js');

const blogSchema = new Schema({
    title:{
        type: 'string',
        required: true  

    },
    body:{
        type:'string',
        required: true,

    },
    coverImageUrl:{
        type: 'string',
        required:  false

    },
    createdBy:{

      type: Schema.Types.ObjectId,
      ref:'User'  
    }
},{timestamps:true})

const Blog= model('blog',blogSchema)

module.exports = Blog;