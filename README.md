-   [basic commands](#basic-commands)
-   [CRUD operations](#crud-operations)
-   [projections](#projections)

# basic commands

**show all databases**

```
show dbs
```

**switch to specific database**

```
use [name]
```

**drop database**

```
db.dropDatabase()
```

**drop collection**

```
db.myCollection.drop()
```

This command can be used even if database with the given name doesn't exists yet (it will be created, once we start entering data to it).

# CRUD operations

## Create

-   insertOne(data, options)
-   insertMany(data, options)

## Read

-   find(filter, options)
-   findOne(filter, options)

## Update

-   updateOne(filter, data, options)
-   updateMany(filter, data, options)
-   replaceOne(filter, data, options)

## Delete

-   deleteOne(filter, options)
-   deleteMany(filter, options)

### insertOne

```
db.[name-of-document].insertOne([json data])
```

```javascript
db.products.insertOne({ name: 'watches', price: '198.99' });
```

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

### updateOne

In case of update one, first thing we need to pass to this method is a filter, that is, a document to filter the data against.

If we want to update just some of the properties of the document, not the whole document, then we need to use **\$set**, which is a special mongodb operator. This operator is then followed by a subdocument (key/value pairs) that we want to update on the matched document.

```javascript
db.products.updateOne(
    { name: "Watches"},
    { $set: { price: 149.99, madeIn: "China" } } }
)
```

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
