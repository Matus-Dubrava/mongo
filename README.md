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

### insert one document

```
db.[name-of-document].insertOne([json data])

// eg.: db.products.insertOne({ name: "Watches", price: "198.99" })
```
