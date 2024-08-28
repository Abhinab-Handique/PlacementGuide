const {Schema ,model }= require('mongoose');


const CommentSchema = new Schema({
    content:{
        type: 'string',
        required: true,
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref: 'blog',

    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:'User',
    },
},{
    timestamps:true,
}
);

const Comments= model('Comment',CommentSchema)

module.exports = Comments;

