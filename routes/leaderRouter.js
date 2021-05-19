const express = require('express')
const bodyParser = require('body-parser')
const Leaders = require('../models/leaders')
const authencicate = require('../authenticate')

const leaderRouter = express.Router()

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then((leader) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(leader)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        Leaders.create(req.body)
            .then((leader) => {
                console.log('Leader Created ', leader)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(leader)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('PUT operrtion not supported on /leaders')
    })
    .delete(authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        Leaders.remove({})
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then((leader) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(leader)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('POST operrtion not supported on /leaders/' + req.params.leaderId)
    })
    .put(authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true })
            .then((leader) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(leader)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authencicate.verifyUser, authencicate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

module.exports = leaderRouter