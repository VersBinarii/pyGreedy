"""This will parse specified raw call data,
normalize them and load them to the mongo database"""
import sys
from Queue import Queue

import CallMediation
from grnti_parser import prepare_raw_calls


def main(argv):
    """Main entry point for the script."""
    if len(argv) < 2:
        print "Need to specify the filename"
        return

    # Main stuff starts here
    queue = Queue()
    for i in range(20):
        t = CallMediation.CallMediation(queue)
        t.setDaemon(True)
        t.start()

    prepare_raw_calls(argv[1], queue)

    queue.join()
if __name__ == '__main__':
    main(sys.argv)
