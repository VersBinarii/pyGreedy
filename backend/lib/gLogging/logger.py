import logging
import logging.handlers

class gLogging():

        def __init__(self):
                pass

        def setLogger(logfile="~/pyGreedy/log/mediation.log", progname="pyGreedy"):

                g_logger = logging.getLogger(progname)
                g_logger.setLevel(logging.INFO)
                
                # add handler
                file_handler = logging.handlers.RotatingFileHandler(logfile, maxBytes=10240, backupCount=5)
                file_handler.setLevel(logging.INFO)
                formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
                file_handler.setFormatter(formatter)
                g_logger.addHandler(file_handler)
                
                return g_logger
    
