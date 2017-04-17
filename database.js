var mongodb = require("mongodb");

function executeCommand(command, callback, ...args) {
    var MongoClient = mongodb.MongoClient;
    // Connection URL 
    var url = 'mongodb://127.0.0.1:27017/todos';
    // Use connect method to connect to the Server 
    MongoClient.connect(url, function (err, db) {
        command(db.collection("todos"), callback, ...args);
        db.close();
    });
}

function preprocessData(data) {
    if (typeof (data._id) === "string") {
        data._id = mongodb.ObjectID.createFromHexString(data._id);
    }
    for (var p in data) {
        if (data[p] === 'true') {
            data[p] = true;
        } else if (data[p] === 'false') {
            data[p] = false;
        }
    }
}

exports.insert = function (doc, callback) {
    preprocessData(doc);
    executeCommand(function (collection, callback, doc) {
        collection.insertOne(doc, callback);
    }, callback, doc);
};
exports.update = function (update, callback) {
    preprocessData(update);
    var filter = {
        _id: update._id
    };
    executeCommand(function (collection, callback, filter, update) {
        collection.updateOne(filter, update, callback);
    }, callback, filter, update);
};
exports.delete = function (filter, callback) {
    preprocessData(filter);
    executeCommand(function (collection, callback, filter) {
        collection.deleteOne(filter, callback);
    }, callback, filter);
};
exports.find = function (callback) {
    executeCommand(function (collection, callback) {
        collection.find().toArray(callback);
    }, callback);
};