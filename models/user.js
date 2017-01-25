const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userId: { type: String, trim: true },
    userName: { type: String, default: '某路人' },
    enName: { type: String, default: 'Unnamed' },
    enabled: { type: Boolean, default: false },
    createDate: Date,
    records: [{
        begin: Date,
        end: Date,
        sequence: Number,
        actionId: {
            type: String,
            trim: true
        }
    }],
    books: [{
        type: String,
        trim: true
    }],
    login: [{
        type: Date
    }],
    actions: [{
        type: String,
        trim: true
    }]
})

UserSchema.path('userId').required(true, 'User ID cannot be blank');
UserSchema.path('userName').required(true, 'User name cannot be blank');

mongoose.model('User', UserSchema);