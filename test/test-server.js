global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create({name: 'Broad beans'},
                        {name: 'Tomatoes'},
                        {name: 'Peppers'}, function() {
                done();
            });
        });
    });
    
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].name.should.equal('Broad beans');
                res.body[0].should.be.a('object');
                res.body[0].should.have.a.property('_id');
                res.body[0]._id.should.be.a('string');
                done();
            });
    });
    
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
            should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.should.should.be.object;
                res.body.should.have.property('name');
                res.body.name.should.be.a.string;
                res.body.should.have.property('_id');
                res.body._id.should.be.a.string;
                Item.find(function(err, item) {
                    item.should.be.a.array;
                    item.should.have.length(4);
                    item[3].should.have.a.property('name');
                    item[3].name.should.be.a.string;
                    item[3].should.have.a.property('_id');
                    item[3]._id.should.be.a.string;
                    item[3].name.should.equal('Kale');
                });
            done();
            });
    });
    
    it('should edit an item on put', function(done) {
        Item.find(function(err, item) {
        chai.request(app)
            .put('/items/' + item[0].id)
            .send({'name': 'Apples'})
            .end(function(err, res) {
            should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.should.should.be.a.object;
                res.body.should.have.property('name');
                res.body.name.should.be.a.string;
                res.body.should.have.property('_id');
                res.body._id.should.be.a.string;
                item.should.be.a.array;
                item.should.have.length(4);
                item[0].should.have.a.property('name');
                item[0].name.should.be.a.string;
                item[0].should.have.a.property('_id');
                item[0]._id.should.be.a.string;
                // item[0].name.should.equal('Apple');
            done();
            });
        });
    });
    
    it('should delete an item on delete', function(done) {
        Item.find(function(err, item) {
        chai.request(app)
            .put('/items/' + item[0].id)
            .end(function(err, res) {
            should.equal(err, null);
                res.should.have.status(200);
                done();
            });
        });
        });
    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});