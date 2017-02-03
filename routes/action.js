const mongoose = require('mongoose')
var express = require('express');
var router = express.Router();
var retMessage = require('../static/retMessageCh')

const Action = mongoose.model('Action')
const ActivatedAction = mongoose.model('ActivatedAction')
const User = mongoose.model('User')

const checkinAvailable = (action, date) => {
    let res = !action || action.checked == false || date - action.timestamp > 1000 * 60 * 60 * 4
    return res
}

const validCheckout = (action, date) => {
    date = date || new Date()
    return action.checked = true && date - action.timestamp > 0 && date - action.timestamp < 1000 * 60 * 60 * 4
}

router.use((req, res, next) => {
    let userId = req.body && req.body.userId
    if (userId) {
        User.find({
            userId: userId
        }, (err, resp) => {
            if (err) {
                res.send(err)
            } else {
                if (resp && resp[0]) {
                    if (!resp[0].actions.find(actionId => {
                            return actionId == req.body.actionId
                        })) {
                        req.body.noExistingAction = true
                    }
                    req.body.actionList = resp[0].actions || []
                    next()
                } else {
                    res.send(retMessage.ERROR_NONEXIST_USER)
                }
            }
        })
    } else {
        res.send(retMessage.ERROR_UNKNOWN_USER)
    }
});

/* Checkin */
router.post('/checkin', function(req, res, next) {
    var actionId = req.body.actionId
    if (actionId) {
        Action.find({
            actionId: actionId
        }, (err, action) => {
            if (err) {
                res.send(err)
            } else {
                let current = new Date()
                if (action && checkinAvailable(action[0], current)) {
                    Action.update({
                        actionId: actionId
                    }, {
                        $set: {
                            checked: true,
                            timestamp: current
                        }
                    }, function(err) {
                        if (err) {
                            res.send(err)
                        } else {
                            ActivatedAction.findOneAndUpdate({ actionId: actionId }, {
                                actionId: actionId,
                                userId: req.body.userId,
                                actionName: action[0].actionName,
                                checkinTime: current
                            }, { upsert: true }, err => {
                                if (err) {
                                    console.error(err)
                                }
                            })
                            res.send(retMessage.SUCCESS('签到'))
                        }
                    })
                } else {
                    res.send(retMessage.ERROR_NO_DATA)
                }
            }
        })

    } else {
        res.send(retMessage.ERROR_INVALID_INPUT)
    }
});

/* Checkout */
router.post('/checkout', function(req, res, next) {
    var actionId = req.body.actionId
    if (actionId) {
        Action.find({
            actionId: actionId
        }, (err, action) => {
            if (err) {
                res.send(err)
            } else {
                let current = new Date()
                if (action && validCheckout(action[0], current)) {
                    Action.update({
                        actionId: actionId
                    }, {
                        $inc: {
                            sequence: 1,
                            totalTime: ((current - action[0].timestamp) / 1000 / 60).toFixed(2)
                        },
                        $set: {
                            checked: false
                        },
                        $push: {
                            records: {
                                sequence: action[0].sequence,
                                begin: action[0].timestamp,
                                end: current
                            }
                        }
                    }, function(err, action) {
                        if (err) {
                            res.send(err)
                        } else {
                            ActivatedAction.findOneAndRemove({
                                actionId: actionId
                            }, (err, res) => {
                                console.log(err || '修改数据库状态成功')
                            })
                            res.send(retMessage.SUCCESS('签出'))
                        }
                    })
                } else {
                    res.send(retMessage.ERROR_NO_DATA)
                }
            }
        })

    } else {
        res.send(retMessage.ERROR_INVALID_INPUT)
    }
});

/* Create action */
router.post('/newAction', function(req, res, next) {
    var actionId = req.body.actionId
    if (actionId) {
        Action.find({
            actionId: actionId
        }, (err, action) => {
            if (err) {
                res.send(err)
            } else {
                if (action && action[0]) {
                    res.send(retMessage.ERROR_DATA_CONFLICT)
                } else {
                    let newAction = new Action({
                        actionId: actionId,
                        actionName: req.body.actionName
                    })
                    newAction.save(function(err, resp) {
                        if (err) {
                            res.send(err);
                        } else {
                            User.update({ userId: req.body.userId }, {
                                $addToSet: {
                                    actions: actionId
                                }
                            }, (err) => {
                                if (err) {
                                    res.send(err)
                                } else {
                                    res.send(retMessage.SUCCESS('添加活动'))
                                }
                            })

                        }
                    })
                }
            }
        })
    } else {
        res.send(retMessage.ERROR_INVALID_INPUT)
    }
});

//checked actions
router.post('/checklist', (req, res, next) => {
    let userId = req.body.userId
    ActivatedAction.find({ userId: userId }, 'actionId actionName checkinTime', (err, actions) => {
        console.log('checklist')
        console.log(actions)
        if (err) {
            res.send(err)
        } else {
            let resList = []
            actions.forEach((action) => {
                resList.push({
                    actionId: action.actionId,
                    actionName: action.actionName,
                    checkinTime: action.checkinTime
                })
            })
            res.send(resList)
        }
    })
})

//checked actions
router.post('/actionList', (req, res, next) => {
    console.log(req.body.actionList)
    Action.find({ actionId: { $in: req.body.actionList } }, (err, actions) => {
        console.log('actionList')
        console.log(actions)
        if (err) {
            res.send(err)
        } else {
            let resList = []
            actions.forEach((action) => {
                resList.push({
                    actionName: action.actionName,
                    totalTime: action.totalTime,
                    checked: action.checked,
                    timestamp: action.timestamp
                })
            })
            res.send(resList)
        }
    })
})

module.exports = router;