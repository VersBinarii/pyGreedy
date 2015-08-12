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
