const mongoose = require('mongoose')
const User = mongoose.model('User')
var express = require('express');
var router = express.Router();
const retMessage = require('../static/retMessageCh')

router.post('/addUser', function(req, res, next) {
    let user = req.body
    let userId = user && user.userId
    if (userId) {
        User.find({
            userId: userId
        }, (err, resp) => {
            if (err) {
                res.send(err)
            } else {
                if (resp && resp[0]) {
                    res.send(retMessage.ERROR_DATA_CONFLICT)
                } else {
                    let newUser = new User({
                        userId: userId,
                        userName: user.userName || '',
                        enName: user.enName || '',
                        enabled: true,
                        createDate: new Date()
                    })
                    newUser.save((err, resp) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.send(retMessage.SUCCESS('创建用户'))
                        }
                    })
                }
            }
        })
    } else {
        res.send(retMessage.ERROR_INVALID_INPUT)
    }
});

module.exports = router;