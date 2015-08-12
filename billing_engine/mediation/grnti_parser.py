from datetime import datetime, date, time


def line_to_cdr(l):
    line = l.rstrip("\n").split(" ")

    # Extract interesting bits from line.
    d = date(int(line[4][:4]), int(line[4][4:6]), int(line[4][6:]))
    t = time(int(line[5][:2]), int(line[5][2:4]), int(line[5][4:]))

    cdr_line = {
        'cdr_type': line[0].split("$")[0], 'account_id': line[2],
        'direction': line[3], 'call_date': datetime.combine(d, t),
        'call_length': line[6], 'calling_num_1': line[15],
        'calling_num_2': line[17], 'called_num_1': line[21],
        'called_num_2': line[25], 'operator_id': line[29],
        'in_trunk': line[31], 'out_trunk': line[32]
    }

    # Now lets find the d-pkg.
    for idx1, field1 in enumerate(line[32:], start=32):
        if field1.startswith("D"):
            cdr_line['d-pkg'] = ''.join([line[idx1+1], line[idx1+2]])
            idx1 += 2
            break

    for idx2, field2 in enumerate(line[idx1:], start=idx1):
        if field2.startswith("H"):
            cdr_line['h-pkg'] = line[idx2+2]
            break

    # All done here.
    return cdr_line

def prepare_raw_calls(filename, queue):
    # Temp container for raw CDRs.
    bucket = {}
    with open(filename, 'r') as grnti_file:
        print "Found file: [%s]\n" % filename
        for line in grnti_file:
            cdr = line_to_cdr(line)
            if cdr['d-pkg'] in bucket:
                # Ensure that TR cdr is always first.
                if cdr['cdr_type'] == 'TR':
                    cdr_pair = (cdr, bucket[cdr['d-pkg']])
                else:
                    cdr_pair = (bucket[cdr['d-pkg']], cdr)
                    # Keep the bucket tidy.
                del bucket[cdr['d-pkg']]
                queue.put(cdr_pair)
                print "putting cdr_pair\n"

            else:
                bucket[cdr['d-pkg']] = cdr

    # Now empty the buckets with "no-pairs" to queue.
    for nopair in bucket.values():
        # But still maintain the order.
        if nopair['cdr_type'] == 'TR':
            cdr_pair = (nopair, None)
        else:
            cdr_pair = (None, nopair)
            
        queue.put(cdr_pair)
    # Let the consumer know we done.
    print "Putting NULL tuple\n"
    queue.put((None, None))
