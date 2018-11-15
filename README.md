-   [basic commands](#basic-commands)
-   [Shell utilities](#shell-utilities)
-   [CRUD operations](#crud-operations)
    -   [Create](#create)
        -   [insertOne](#insertone)
        -   [insertMany](#insertmany)
        -   [ordered inserts](#ordered-inserts)
        -   [write concern](#write-concern)
        -   [importing data](#importing-data)
    -   [Read](#read)
        -   [find](#find)
        -   [quering nested documents](#quering-nested-documents)
    -   [Update](#update)
    -   [Delete](#delete)
-   [projections](#projections)
-   [indexes](#indexes)

# basic commands

**show all databases**

```
show dbs
```

**switch to specific database**

```
use [name]
```

This command can be used even if database with the given name doesn't exists yet (it will be created, once we start entering data to it).

**drop database**

```
db.dropDatabase()
```

**drop collection**

```
db.myCollection.drop()
```

# Shell utilities

-   start mongo server

```
sudo mongod
```

-   set a different db path (default is `/data/db`)

```
sudo mongod --dbpath path-to-db/db
```

-   set custom log path, unlike in the previous command, where we pointed the path to somo folder, here we need to provide a path to a specific file

```
sudo mongod --logpath path-to-logs/logs/log.log
```

-   shutdown the server

run `mongo` command

then switch to _admin_ database `use admin`

then run `db.shutdownServer()`

# CRUD operations

## Create

-   insertOne(data, options)
-   insertMany(data, options)

### insertOne

```javascript
db.collectionName.insertOne(data);
```

```javascript
db.products.insertOne({ name: 'watches', price: '198.99' });
```

### insertMany

**insertMany** is the same as **insertOne** method, but instead of passing in just one object (JSON), we are passing multiple such objects in one array

```javascript
db.products.insertMany([
    {
        name: 'watches',
        price: '198.99'
    },
    {
        name: 'banana',
        price: '0.3'
    }
]);
```

### ordered inserts

By default, each document in an array that is passed in to **insertMany** method is inserted separatelly, meaning that a separate insert operation is run for each of these document. If any of these operations fails, then all the process is stopped (without performing rollback).

If, however, we want to continue inserting documents even if one, or more of them can't be inserted, we can pass in a second argument to the **insertMany** method, where we need to specify **ordered** property and set it to _false_ (it is set to _true_ by default).

```javascript
db.insertMany([...], { ordered: false });
```

### write concern

When we execute insert operation on mongodb, the data is not immediatelly saved to file system, instead it is just stored inside of memory where the object to be then saved is created and we get a response with the according objectId of that newly created object.

This, obviously, can fail if the memory in which the object is stored is wiped before it is saved to file system.

If we want to be sure that we get response about successful insert operation only once the data has actually been stored in a reliable way, we can create so called **journal** file that will store the operations that need to be performed. In such case, even if memory fails, the operation will still be performed once a server is rebooted, because we have logged information about the insert operation.

```javascript
db.products.insertOne({ name: 'PC' }, { writeConcern: { j: true } });
```

In the above command, `j` stands for journal.

### importing data

If we need to import json data into our database, we can use this command (outside of mongo shell).

```javascript
mongoimport my-data.json -d databaseName -c collectionName --jsonArray --drop
```

`my-data.json` is the file that we want to import (if we are running this command inside of the folder where this file sits, otherwise we need to provide full path to the file)

`-d databaseName` is the name of the database that should be used for this data (doesn't need to exists)

`-c collectionName` same as above, but with respect to collection

`--jsonArray` should be specified if the data that we are importing is an array instead of single object.

`--drop` should be specified to drop the specified database if it exists and create a new one with that name (otherwise the data will be appended to the already existing data)

## Read

-   find(filter, options)
-   findOne(filter, options)

### find

Find returns all the documents that match the specified filter which is the first argument passed in to the find method.

```javascript
db.products.find({ price: 149.99 });
```

Important thing to note here is that it doesn't really return documents, but instead it returns object that is called _cursor_ on which we can invoke additonal methods.
This is simply because our collections may contain large amount of data that we may not need to fetch all at once.

To use this cursor to iterate through the whole collection, one document at a time, and possibly do something with each individual document, we can invoke **forEach** method on the cursor and pass a callback function to it.

```javascript
db.products.find().forEach(product => printjson(product));
```

If we are sure that we need all the documents at once, we can invoke _cursor_'s **toArray** method which returns an array filled with all the documents.

```javascript
db.products.find().toArray();
```

Considering the filter, we can do more than just filter based on equality of some key/value pairs. We can, for example, want to find all the products with price greater than 100. To achieve that, we need to use another special mongodb operator **\$gt** (which stands for _greater than_).

```javascript
db.products.find({ price: { $gt: 100 } });
```

There are also other comparison operators that we can use. For example, **\$eq** matches values that are equal to a specified value and **\$lte** matches values that are less than or equal to a specified value.

### quering nested documents

In case we want to query nested documents, we need to specify the whole path to the field.

```javascript
{
    name: "watches",
    rating: {
        average: 9.3
    }
}

db.products.find("rating.average": { $gt: 8 });
```

## Update

-   updateOne(filter, data, options)
-   updateMany(filter, data, options)
-   replaceOne(filter, data, options)

### updating matched array element

## Delete

-   deleteOne(filter, options)
-   deleteMany(filter, options)

### updateOne

In case of update one, first thing we need to pass to this method is a filter, that is, a document to filter the data against.

If we want to update just some of the properties of the document, not the whole document, then we need to use **\$set**, which is a special mongodb operator. This operator is then followed by a subdocument (key/value pairs) that we want to update on the matched document.

```javascript
db.products.updateOne(
    { name: "Watches"},
    { $set: { price: 149.99, madeIn: "China" } } }
)
```

# projections

If we need to fetch documents but only need some of their fields, it might make sense to fetch only the data that we actually need, omitting the rest.

Let's assume that we have documents with this structure.

```javascript
{
    name: 'Jim',
    email: 'test@test.com',
    password: '1902jd210jd291m120d',
    cart: {
        items: ['product_id1', 'product_id2', 'product_id3']
    }
}
```

For a certain type of tasks, we might only need user's email. What we can do is to fetch such documents and then transform them on our backend.

The better approach though is to tell mongodb that we are interested only in _name_ and let the mongodb to perform this transformation, or more precisely, to create a projection which will then be sent to our backend. Not only can mongodb perform such operation more efficiently, but we are also sending possibly much less data through the network.

To tell mongodb to return such projection, we need to specify the second argument for the **find** method, which is an object where we specify fields with values 0 or 1. 0 means that the field should not be included in the projection (1 for include). If we pass this second argument, then values for all the properties are set to 0 by default, except for _\_id_ which is set to 1. Therefore, if we pass in empty object, then we will receive projection that will contain only ids of documents.

```javascript
db.users.find({}, { name: 1 });
```

# Data Types

-   _text_ - simple strings
-   _boolean_ - true / false
-   _numbers_ - int32 | int64 | decimal numbers
-   _ObjectId_ - unique values used for ids
-   _ISODate_ - date format
-   _timestamp_ - date that is guaranteed to be unique
-   _embedded documents_
-   _arrays_

# indexes

To see all indexes that have been created for a collection, we can issue this command.

```javascript
db.mycollection.getIndexes();
```

If we want to create a new, simple (single-field) index

```javascript
db.mycollection.createIndex({ name: 1 });
```

where `name` is name of the field that we want to create index on and `1` simply means that the index should be sortend in ascending order (`-1` for descending order).

Deletion of index can be done by

```javascript
db.mycollection.dropIndex({ name: 1 });
```

## compound indexes

We can use more than just one field when we are building an index.

```javascript
db.mycollection.createIndex({ name: 1, age: 1 });
```

In this case, both name and age will be part of the index and we can use either `name` or `name and age` fileds for efficient queries. Note that the order here matters. We can't use only `age` in such case because those fields are ordered from left to right. Meaning that mongodb firsts sorts based on `name` and then performs nested sorting based on `age` field.

These queries will use the above created index.

```javascript
db.mycollection.find({ name: 'some name' });

db.mycollection.find({ name: 'some name', age: { $gt: 30 } });
```

But this query will not. Mongodb in this case will use collection scan, which means that it will scan through the whole collection to find the requested documents.

```javascript
db.mycollection.find({ age: { $gt: 30 } });
```

## query plan

To see how exacly mongodb handles given query (type of used scan and some other statistics), we can use `explain` method.

```javascript
db.mycollection.explain().find({ name: 'Matus' });
```

We can also pass a string argument to `explain` to specify how much data we want the mongodb to show us, e.g `executionStats` to see more detailed statistics.

There, in the output of the `explain` method, we can find property with name `winningPlan` which represents the plan that mongodb is going with for the given query.

`winningPlan` has property with name `stage`. If we execute those two commands from the previous section where we are expecting mongodb to use index scan, then we can observe this by looking at the value of `stage` property which should, and indeed is `IXSCAN`. In case of the third command for which mongodb has to go through the whole collection, `stage` has value `COLLSCAN`.

Another interesting field is `rejectedPlans` where we can see some other plans that mongodb considered but rejected them because it deemed them to be slower than the winning one, which should be the fastest out of every competing plan.

If we are searching for a field (or at least part of our query contains the field) that is included in multiple indexes (we can have several compound indexes where each of them includes the same field), then mongodb needs to choose which index to use for a given query, rejecting the others. To achieve this, mongodb firsts runs a test query on a small subset of the collection and picks the fastest one. Not only it chooses the best index to use, but it also caches the result which it will reuse in future if it encounters the same exact query (note that this case is not stored forewer, it will get erased it the mongodb server restarts for example, but also after certain amount of insert operations etc.).

## text indexes

To create text index for a field, we can use the following syntax.

```javascript
```
