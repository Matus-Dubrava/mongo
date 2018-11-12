db.createCollection('posts', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'text', 'creator', 'comments'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                text: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                creator: {
                    bsonType: 'objectId',
                    description: 'must be an objectId and is required'
                },
                comments: {
                    bsonType: 'array',
                    description: 'must be an array and is required',
                    items: {
                        bsonType: 'object',
                        required: ['text', 'author'],
                        properties: {
                            text: {
                                bsonType: 'string',
                                description:
                                    'must be an objectId and is required'
                            },
                            author: {
                                bsonType: 'objectId',
                                description:
                                    'must be an objectId and is required'
                            }
                        }
                    }
                }
            }
        }
    }
});

db.runCommand({
    collMod: 'posts',
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'text', 'creator', 'comments'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                text: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                creator: {
                    bsonType: 'objectId',
                    description: 'must be an objectId and is required'
                },
                comments: {
                    bsonType: 'array',
                    description: 'must be an array and is required',
                    items: {
                        bsonType: 'object',
                        required: ['text', 'author'],
                        properties: {
                            text: {
                                bsonType: 'string',
                                description:
                                    'must be an objectId and is required'
                            },
                            author: {
                                bsonType: 'objectId',
                                description:
                                    'must be an objectId and is required'
                            }
                        }
                    }
                }
            }
        }
    },
    validationAction: 'warn'
});

const post1 = {
    title: 'My first Post!',
    text: 'this is my first post, I hope you like it',
    tags: ['new', 'tech'],
    creator: ObjectId('5be9364fb773148d5ce778d1'),
    comments: [
        {
            text: 'I like this post',
            author: ObjectId('5be9364fb773148d5ce778d1')
        }
    ]
};
