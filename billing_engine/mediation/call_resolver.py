from grnti_parser import line_to_cdr
import db_handler
'''
Takes call tuple (TR, Gx) and finds the type of the call.
Tuple can be (TR, Gx), (None, Gx) or (TR, None)
'''


def find_call_type(queue):

    # First connect to db.
    db = db_handler
    database = db.db_connect()
    mediatedcalls = db.db_get_collection(database)
    numbers = db.db_get_collection(database, 'numbers')
    accounts = db.db_get_collection(database, 'accounts')

    while not queue.empty():

        cdr_pair = queue.get()
        # Start finding what is what with the calls.
        cdr1 = cdr_pair[0]
        cdr2 = cdr_pair[1]
        # If no TR then its either normal GO or GI
        if cdr1 is None and cdr2 is not None:

            # Prep call object
            call = {
                'date': cdr2['call_date'], 'length': cdr2['call_length'],
                'calling_num': cdr2['calling_num_1'],
                'called_num': cdr2['called_num_2'],
                'account_id': cdr2['account']
            }
            
            if cdr2['cdr_type'] == "GI":

                call['direction'] = "IN"
                call['calltype'] = "NB"
                call['valid'] = True
                call['note'] = "Class 5 inbound call"

            elif cdr2['cdr_type'] == "GO":
                
                call['direction'] = "OUT"
                call['calltype'] = "V"
                call['valid'] = True
                call['note'] = "Class 5 outbound call"

            else:
                call['direction'] = ""
                call['calltype'] = ""
                call['valid'] = False
                call['note'] = "Cannot find call type"

            # Have call so load to db.
            db.db_collection_insert(mediatedcalls, call)

        # Only a transit ticket.
        if cdr1 is not None and cdr2 is None:

            # Prep the call object
            call = {
                'date': cdr1['call_date'], 'length': cdr1['call_length'],
                'calling_num': cdr1['calling_num_1'],
                'called_num': cdr1['called_num_2']
            }

            # Check for account by trunkname
            trunkname = cdr1['in_trunk'].replace("loop[", "")[:-1]
            account = db.db_collection_find({'trunk': {'$regex': '*'+trunkname+'*'}})

            if account:
                call['account_id'] = account
            else:
                # Unknown account so just store what we have 
                call['account_id'] = ""
                call['valid'] = True
                call['note'] = "Transit outbound call"
                db.db_collection_insert(mediatedcalls, call)
                continue
                
            if cdr1['operator_id'].startswith("WTR_"):

                # Wholesale transit

                call['direction'] = 'OUT'
                call['calltype'] = "TR_OUT"
                call['valid'] = True
                call['note'] = "Transit outbound call"

            elif "_IN" in cdr1['operator_id']:

                # We have TR incoming

                call['direction'] = 'IN'
                call['calltype'] = "TR_IN"
                call['valid'] = True
                call['note'] = 'Transit inbound call'

            else:
                # Something dunno whats with the call

                call['direction'] = ''
                call['calltype'] = ""
                call['valid'] = False
                call['note'] = 'Could not recognize call'

            # Have call so load to db.
            db.db_collection_insert(mediatedcalls, call)

        if cdr1 is not None and cdr2 is not None:
            if cdr1['operator_id'].startswith("WLR_") or\
               cdr2['operator_id'].startswith("WLR_"):

                # Prepare the call object.
                call = {
                    'date': cdr1['call_date'], 'length': cdr1['call_length'],
                    'calling_num': cdr1['calling_num_1'], 'direction': 'OUT',
                    'called_num': cdr1['called_num_2'], 'calltype': "WLR"
                }
                '''
                WLR is tricky, it has to be identified by CLI
                so need to do a DB query
                '''
                account = db.db_collection_find(numbers, {
                    "number": cdr1['calling_num_1']
                })

                if account:
                    call['account'] = account
                    call['valid'] = True
                    call['note'] = "WLR call"

                else:
                    call['account_id'] = ""
                    call['valid'] = False
                    call['note'] = 'Unknown CLI'

                # Unknown or not we have call so load to db.
                db.db_collection_insert(mediatedcalls, call)

            if "IN_18xx" in cdr1['operator_id']:
                pass
            
        queue.task_done()


def prepare_raw_calls(filename, queue):
    # Temp container for raw CDRs.
    bucket = {}
    with open(filename, 'r') as grnti_file:
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
    return
