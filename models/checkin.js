const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CheckinSchema = new Schema({
    actionId: { type: String, trim: true },
    sequence: { type: Number },
    checkin: {
        time: Date
    },
    checkout: {
        time: Date
    },
    unfinished: { type: Boolean, default: true },
    inValid: { type: Boolean, default: false }
})

CheckinSchema.path('actionId').required(true, 'Action ID cannot be blank');

mongoose.model('Checkin', CheckinSchema);