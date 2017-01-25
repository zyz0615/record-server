const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    bookName: { type: String, trim: true, default: '未知书名' },
    format: [{ type: String, trim: true }],
    enName: { type: String, default: 'Unnamed' },
    finished: [{ userId: { type: String, trim: true } }],
    createDate: Date,
    records: [{
        create: Date,
        finish: Date,
        userId: {
            type: String,
            trim: true
        }
    }]
})

BookSchema.path('bookName').required(true, 'Book name cannot be blank');

mongoose.model('Book', BookSchema);