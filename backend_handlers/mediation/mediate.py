"""This will parse specified raw call data,
normalize them and load them to the mongo database"""
import sys
import os
from Queue import Queue

import CallMediation
from grnti_parser import prepare_raw_calls
from gLogger import setLogger


def main(argv):
    """Main entry point for the script."""

    # Lets start from logger
    logger = setLogger(logfile="mediation_proc.log")
    
    if len(argv) < 2:
        logger.error("Not enough arguments. Dying...")
        return

    queue = Queue()
    for i in range(10):
        t = CallMediation.CallMediation(queue)
        t.setDaemon(True)
        t.start()

    # Read whole directy and parse all grnti files.
    logger.info( "Reading directory [%s]\n" % argv[1])
    [prepare_raw_calls(''.join((argv[1], f)), queue)
     for f in os.listdir(argv[1]) if f.startswith("grnti")]

    queue.join()
if __name__ == '__main__':
    main(sys.argv)
