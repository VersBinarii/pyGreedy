"""This will parse specified raw call data, 
normalize them and load them to the mongo database"""
import sys
from grnti_parser import parse_line

def main(argv):
    """Main entry point for the script."""
    if len(argv) < 2:
        print "Need to give the filename"
        return

    bucket = {}
    queue = []
    with open(argv[1], 'r') as grnti_file:
        for line in grnti_file:
            
            cdr = parse_line(line)
            if cdr['d-pkg'] in bucket:
                # Ensure that TR cdr is always first.
                if cdr['cdr_type'] == 'TR':
                    cdr_pair = (cdr, bucket[cdr['d-pkg']])
                else:
                    cdr_pair = (bucket[cdr['d-pkg']], cdr)

                del bucket[cdr['d-pkg']]
                queue.append(cdr_pair)

            else:
                bucket[cdr['d-pkg']] = cdr


    # Now empty the buckets with "no-pairs" to queue
    for nopair in bucket.values():
        # Ensure that TR cdr is always first.
        if nopair['cdr_type'] == 'TR':
            cdr_pair = (nopair, None)
        else:
            cdr_pair = (None, nopair)
            
        queue.append(cdr_pair)
        
    print queue            

                    
            
if __name__ == '__main__':
    main(sys.argv)

