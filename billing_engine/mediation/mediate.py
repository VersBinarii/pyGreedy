"""This will parse specified raw call data, 
normalize them and load them to the mongo database"""
import sys
from grnti_parser import parse_line

def main(argv):
    """Main entry point for the script."""
    if len(argv) < 2:
        print "Need to give the filename"
        return
    
    with open(argv[1], 'r') as grnti_file:
        for line in grnti_file:
            
            parse_line(line)
            
            
if __name__ == '__main__':
    main(sys.argv)

