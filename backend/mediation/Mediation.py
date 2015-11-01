import threading
import dbhandler as db
import logging

'''
Takes call tuple (TR, Gx) and finds the type of the call.
Tuple can be (TR, Gx), (None, Gx) or (TR, None)
'''

LOG = logging.getLogger('pyGreedy')


class Mediation(threading.Thread):

    def __init__(self, queue, database):
        threading.Thread.__init__(self)
        self.queue = queue
        self.mdb = database
        
    def run(self):
        t_run = True
        while t_run:
            pair = self.queue.get(timeout=10)
            if pair[0] is None and pair[1] is None:
                t_run = False
            else:
                self.find_call_type(pair)
            self.queue.task_done()

    def find_call_type(self, cdr_pair):

        # Start finding what is what with the calls.
        cdr1 = cdr_pair[0]
        cdr2 = cdr_pair[1]
        # If no TR then its either normal GO or GI
        if cdr1 is None and cdr2 is not None:
            # Prep call object
            call = {
                'call_date': cdr2['call_date'],
                'length': cdr2['call_length'],
                'calling_num': cdr2['calling_num_1'],
                'called_num': cdr2['called_num_2'],
                'account_id': cdr2['account_id']
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
                call['direction'] = "?"
                call['calltype'] = "?"
                call['valid'] = False
                call['note'] = "Cannot find call type"
            # Have call so load to db.
            db.coll_save(self.mdb['medcalls'], call)

        # Only a transit ticket.
        if cdr1 is not None and cdr2 is None:
            # Prep the call object
            call = {
                'call_date': cdr1['call_date'],
                'length': cdr1['call_length'],
                'calling_num': cdr1['calling_num_1'],
                'called_num': cdr1['called_num_2']
            }
            # Check for account by trunkname
            trunkname = cdr1['in_trunk'].replace("loop[", "")[:-1]
            account = db.coll_find(self.mdb['accounts'],
                            {'trunk': {'$regex': '*'+trunkname+'*'}})
            if account:
                call['account_id'] = account
            else:
                # Unknown account so just store what we have
                call['account_id'] = "?"
                call['valid'] = False
                call['calltype'] = "?"
                call['direction'] = "?"
                call['note'] = "Cannot find account"
                db.coll_save(self.mdb['medcalls'], call)
                return

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
                call['direction'] = "?"
                call['calltype'] = "?"
                call['valid'] = False
                call['note'] = 'Could not recognize call'
            # Have call so load to db.
            db.coll_save(self.mdb['medcalls'], call)

        if cdr1 is not None and cdr2 is not None:
            if cdr1['operator_id'].startswith("WLR_") or\
               cdr2['operator_id'].startswith("WLR_"):
                # Prepare the call object.
                call = {
                    'call_date': cdr1['call_date'],
                    'length': cdr1['call_length'],
                    'calling_num': cdr1['calling_num_1'], 'direction': 'OUT',
                    'called_num': cdr1['called_num_2'], 'calltype': "WLR"
                }
                # Do number lookup to find account.
                account = db.coll_find(self.mdb['numbers'],
                            {"number": cdr1['calling_num_1']})
                if account:
                    call['account_id'] = account
                    call['valid'] = True
                    call['note'] = "WLR call"
                else:
                    call['account_id'] = "?"
                    call['valid'] = False
                    call['note'] = 'Cannot find the accout'
                    # Unknown or not we have call so load to db.
                    db.coll_save(self.mdb['medcalls'], call)
                    return

            if "IN_18xx" in cdr1['operator_id']:
                # Prepare 2 call objects, one for customer
                # and one for carrier.
                call_customer = {
                    'call_date': cdr1['call_date'],
                    'length': cdr1['call_length'],
                    'calling_num': cdr1['calling_num_1'], 'direction': 'IN',
                    'called_num': cdr1['called_num_2']
                }
                call_carrier = {
                    'call_date': cdr1['call_date'],
                    'length': cdr1['call_length'],
                    'calling_num': cdr1['calling_num_1'], 'direction': 'IN',
                    'called_num': cdr1['called_num_2']
                }
                call_customer['account_id'] = cdr2['account_id']
                call_carrier['account_id'] = "EIRCOM"

                if self.is_number_mobile(cdr1['calling_num_1']):
                    call_customer['calltype'] = "SP_M"
                    call_carrier['calltype'] = "CR_M"
                else:
                    call_customer['calltype'] = "SP_LL"
                    call_carrier['calltype'] = "CR_M"
                    
                call_customer['valid'] = True
                call_customer['note'] = '18xx Inbound call'
                call_carrier['valid'] = True
                call_carrier['note'] = '18xx Inbound call'
                # Finally both to db.
                db.coll_save(self.mdb['medcalls'], call_carrier)
                db.coll_save(self.mdb['medcalls'], call_customer)
            else:
                # Dunno what it is so just save to db.
                # TODO: try find account be calling_number
                call = {
                    'call_date': cdr1['call_date'],
                    'length': cdr1['call_length'],
                    'calling_num': cdr1['calling_num_1'], 'direction': "?",
                    'called_num': cdr1['called_num_2'], 'calltype': "?",
                    'account_id': "?", 'valid': False,
                    'note': "Cannot identify call type"
                }
                db.coll_save(self.mdb['medcalls'], call)

    def is_number_mobile(self, num):
        return num.startswith("83")\
            or num.startswith("85")\
            or num.startswith("86")\
            or num.startswith("87")\
            or num.startswith("88")\
            or num.startswith("89")
