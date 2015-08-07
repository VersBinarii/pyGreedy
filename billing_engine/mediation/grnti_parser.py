import sys

cdr_line = {}

def parse_line(l):
     line = l.rstrip("\n").split(" ")

     # extract interesting bits from line
     cdr_line['account'] = line[2];
     cdr_line['direction'] = line[3];
     cdr_line['call_date'] = line[4] + " "+line[5];
     cdr_line['call_length'] = line[6];
     cdr_line['calling_num_1'] = line[15];
     cdr_line['calling_num_2'] = line[17];
     cdr_line['called_num_1'] = line[21];
     cdr_line['called_num_2'] = line[25];
     cdr_line['operator_id'] = line[29];
     cdr_line['in_trunk'] = line[31];
     cdr_line['out_trunk'] = line[32];

     #now lets find the d-pkg
     
     print cdr_line
