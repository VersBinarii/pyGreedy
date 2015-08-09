from pymongo import MongoClient

'''
Set of handlers to open db connection and
write stuff
'''


def db_connect(url='mongodb://localhost:27017/', db_name='pyGreedy'):
    client = MongoClient(url)
    return client[db_name]


def db_get_collection(db, db_collection='mediatedcalls'):
    return db[db_collection]


def db_collection_insert(collection, mediatedcall):
    return collection.insert_one(mediatedcall).inserted_id


def db_collection_find(collection, query):
    return collection.find_one(query)
