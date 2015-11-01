from pymongo import MongoClient
import logging

'''
Set of handlers to open db connection and
write stuff
'''

LOG = logging.getLogger('pyGreedy')

def connect(url='mongodb://localhost:27017/', db_name='pyGreedy'):
    try:
        client = MongoClient(url)
    except:
        LOG.error("Could not connect to MongoDB server")
        return None
    
    return client[db_name]


def coll_save(collection, obj):
    return collection.insert_one(obj).inserted_id


def coll_find(collection, query):
    return collection.find_one(query)


def coll_update(collection, which, value):
    return collection.update_one(which, value);
