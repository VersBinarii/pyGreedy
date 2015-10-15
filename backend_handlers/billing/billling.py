"""Performs a call rating on the mediated data taken from mongodb"""
import sys
import time
from gLogger import setLogger

def main(argv):
    """Main entry point for the script."""

    # Start with logging init
    LOG = setLogger(logfile="billing_proc.log")
    
    while True:
        time.sleep(5)
        LOG.info("Running")

if __name__ == '__main__':
    main(sys.argv)
    
