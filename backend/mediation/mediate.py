"""This will parse specified raw call data,
normalize them and load them to the mongo database"""

import os
import argparse
import logging
from Queue import Queue

from Mediation import Mediation
from raw_grnti import prepare_raw_calls
import dbhandler as db

def main():
    """Main entry point for the script."""

    # Setup the argument parser
    parser = argparse.ArgumentParser(description="Cirpack/Airspeed CDR mediation script")
    parser.add_argument("-i", help="Directory containing all the CDRs", required=True);
    parser.add_argument("-l", help="Log file directory");
    args = parser.parse_args()
    
    # Lets start the logger
    LOG = setLogger(logfile=args.l)

    # Connect to Mongodb and reqister the collection we will be using
    database = db.connect()
    mongo = {
        'dbase' : database,
        'medproc': database['mediationprocs'],
        'medcalls' : database['mediatedcalls'],
        'accounts' : database['accounts'],
        'numbers' : database['numbers']
    }
    # Tell mongoDB that we are running.
    
    db.coll_update(mongo.medproc,
                         {'name': "Mediation Process"},
                         {'$set': {'running': True}})
    
    queue = Queue()
    for i in range(10):
        t = Mediation(queue, mongo)
        t.setDaemon(True)
        t.start()

    # Read whole directy and parse all grnti files.
    LOG.info( "Reading directory [%s]\n" % args.i)
    [prepare_raw_calls(''.join((args.i, f)), queue, mongo)
     for f in os.listdir(args.i) if f.startswith("grnti")]

    queue.join()

    db.coll_update(dbase['mediationprocs'],
                         {'name': "Mediation Process"},
                         {'$set': {'running': False}})
    LOG.info("Mediation finished");

def setLogger(logfile="~/pyGreedy/log/mediation.log", progname="pyGreedy"):

    g_logger = logging.getLogger(progname)
    g_logger.setLevel(logging.INFO)

    # add handler
    file_handler = logging.FileHandler(logfile)
    file_handler.setLevel(logging.INFO)
    
    g_logger.addHandler(file_handler)

    return g_logger
    

if __name__ == '__main__':
    main()
