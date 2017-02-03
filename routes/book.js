const mongoose = require('mongoose')
const Book = mongoose.model('Book')
const User = mongoose.model('User')
var express = require('express');
var router = express.Router();
const retMessage = require('../static/retMessageCh')

router.use((req, res, next) => {
    let userId = req.body && req.body.userId
    if (userId) {
        User.find({ userId: userId }, (err, resp) => {
            if (err) {
                res.send(err)
            } else {
                if (resp && resp[0]) {
                    req.body.alreadyExist = resp[0].books.find(bookName => {
                        return bookName == req.body.bookName
                    })
                    req.body.bookList = resp[0].books
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

router.post('/newBook', function(req, res, next) {
    if (req.body.alreadyExist) {
        res.send(retMessage.ERROR_DATA_CONFLICT)
    } else {
        let book = req.body
        if (book && book.bookName) {
            Book.find({ bookName: book.bookName }, (err, resp) => {
                if (err) {
                    res.send(err)
                } else {
                    if (resp && resp[0]) {
                        User.update({ userId: book.userId }, {
                            $push: {
                                books: book.bookName
                            }
                        }, (userErr) => {
                            if (userErr) {
                                res.send(userErr)
                            } else {
                                User.update({ userId: book.userId }, {
                                    $addToSet: {
                                        format: book.bookType
                                    }
                                }, (userErr) => {
                                    if (userErr) {
                                        res.send(userErr)
                                    } else {
                                        res.send(retMessage.SUCCESS('添加图书'))
                                    }
                                })
                                res.send(retMessage.SUCCESS('添加图书'))
                            }
                        })
                    } else {
                        let newBook = new Book({
                            bookName: book.bookName,
                            format: [book.bookType || '1'],
                            createDate: new Date()
                        })
                        newBook.save(err => {
                            if (err) {
                                res.send(err)
                            } else {
                                User.update({ userId: book.userId }, {
                                    $push: {
                                        books: book.bookName
                                    }
                                }, (userErr) => {
                                    if (userErr) {
                                        res.send(userErr)
                                    } else {
                                        res.send(retMessage.SUCCESS('添加图书'))
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
    }
});

//book list
router.post('/bookList', (req, res, next) => {
    let bookNames = req.body.bookList || []
    let userId = req.body.userId
    Book.find({ bookName: { $in: bookNames } }, { '_id': 0, bookName: 1, format: 1, createDate: 1, finished: 1 }, (err, resp) => {
        if (err) {
            res.send(err)
        } else {
            let resList = []
            resp.forEach((book) => {
                let flag = book.finished.find((usr) => {
                    return userId == usr
                })
                let isFinished = flag ? true : false
                resList.push({
                    bookName: book.bookName,
                    createDate: book.createDate,
                    isFinished: isFinished,
                    format: book.format
                })
            })
            console.log(resp)
            res.send(resList)
        }
    })
})

module.exports = router;