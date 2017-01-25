const mongoose = require('mongoose')
const Schema = mongoose.Schema

//action schema
const ActionSchema = new Schema({
    actionId: { type: String, trim: true },
    actionName: { type: String, default: 'This guy is lazy, leaving nothing to display...' },
    sequence: { type: Number, default: 1 },
    checked: { type: Boolean, default: false },
    timestamp: Date,
    records: [{
        begin: Date,
        end: Date,
        sequence: Number
    }],
    users: [{ type: String, trim: true }],
    totalTime: { type: Number, default: 0 },
    beforeSystem: { type: Number, default: 0 }
})

ActionSchema.path('actionId').required(true, 'Action ID cannot be blank');

mongoose.model('Action', ActionSchema);

//activated action schema
const ActivatedActionSchema = new Schema({
    actionId: { type: String, trim: true },
    actionName: { type: String, default: 'Unknown action name' },
    userId: { type: String, trim: true },
    checkinTime: Date
})

ActivatedActionSchema.path('actionId').required(true, 'Action ID cannot be blank');
ActivatedActionSchema.path('userId').required(true, 'User ID cannot be blank');

mongoose.model('ActivatedAction', ActivatedActionSchema);