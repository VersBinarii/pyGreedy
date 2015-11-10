"""This will parse specified raw call data,
normalize them and load them to the mongo database"""

import os
import argparse
from Queue import Queue
from daemon import runner
from threading import Timer

from glogging import gLogging
from Mediation import Mediation
from raw_grnti import prepare_raw_calls
import dbhandler as db


class MediationD():

    def __init__(self):
        self.stdin_path = '/dev/null'
        self.stdout_path = '/dev/tty'
        self.stderr_path = '/dev/tty'
        self.pidfile_path =  '/var/run/MediationD/mediationd.pid'
        self.pidfile_timeout = 5
        
        # Setup the argument parser
        parser = argparse.ArgumentParser(description="Cirpack/Airspeed CDR mediation script")
        parser.add_argument("-i", help="Directory containing all the CDRs", required=True)
        parser.add_argument("-l", help="Log file directory")
        parser.add_argument("-p", help="CDR file prefix", default="")
        self.args = parser.parse_args()
    
        # Connect to Mongodb and reqister the collection we will be using
        database = db.connect()
        if database is None:
            LOG.error("Check if MongoDB is running. Exiting for now")
            return

        # Initialize needed db collections
        self.mongo = {
            'dbase' : database,
            'medproc': database['mediationprocs'],
            'medcalls' : database['mediatedcalls'],
            'accounts' : database['accounts'],
            'numbers' : database['numbers']
        }

        #TODO:  Queue size will be eventualy equal to the thread pool size
        self.queue = Queue()
        
    def run(self):
        
        # Tell mongoDB that we are running.
        db.coll_update(self.mongo['medproc'],
                       {'name': "Mediation Process"},
                       {'$set': {'running': True}})
        
        
        for i in range(10):
            t = Mediation(self.queue, self.mongo)
            t.start()


        while True:
            for f in os.listdir(args.i):
                if f.startswith(args.p):
                    LOG.info( "Parsing file {}".format(args.i))
                    prepare_raw_calls(''.join((args.i, f)), self.queue, self.mongo)
            
        queue.join()
            
        db.coll_update(self.mongo['medproc'],
                       {'name': "Mediation Process"},
                       {'$set': {'running': False}})
        
            
mediationd = MediationD()

# Lets start the logger
LOG = gLogging().setLogger(logfile=args.l)

daemon_runner = runner.DaemonRunner(mediationd)
#This ensures that the logger file handle does not get closed during daemonization
daemon_runner.daemon_context.files_preserve=[handler.stream]
daemon_runner.do_action()
