-   [basic commands](#basic-commands)
-   [CRUD operations](#crud-operations)

# basic commands

### show all databases

```
show dbs
```

### switch to specific database

```
use [name]
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

Of course, we can do more than just filter based on equality of some key/value pairs. We can, for example, want to find all the products with price greater than 100. To achieve that, we need to use another special mongodb operator **\$gt** (which stands for _greater than_).

```javascript
db.products.find({ price: { $gt: 100 } });
```

There are also other comparison operators that we can use. For example, **\$eq** matches values that are equal to a specified value and **\$lte** matches values that are less than or equal to a specified value.
