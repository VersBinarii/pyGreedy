from pymongo import MongoClient

'''
Set of handlers to open db connection and
write stuff
'''


def connect(url='mongodb://localhost:27017/', db_name='pyGreedy'):
    client = MongoClient(url)
    return client[db_name]


def collection_insert(collection, obj):
    return collection.insert_one(obj).inserted_id


def collection_find(collection, query):
    return collection.find_one(query)


def collection_update(collection, which, value):
    return collection.update_one(which, value);
