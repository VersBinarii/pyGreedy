"""This will parse specified raw call data, 
normalize them and load them to the mongo database"""
import sys, signal
from Queue import Queue

from  call_resolver import prepare_raw_calls, find_call_type

def main(argv):
    """Main entry point for the script."""
    if len(argv) < 2:
        print "Need to give the filename"
        return

    # Registar SIGINT handler
    signal.signal(signal.SIGTERM, handler)

    # Main stuff starts here
    queue = Queue()
    
    prepare_raw_calls(argv[1], queue);

    find_call_type(queue)
    
    queue.join()
    signal.pause()

def handler(signum, frame):
        print 'Signal handler called with signal', signum
        sys.exit(0)

if __name__ == '__main__':
    main(sys.argv)
