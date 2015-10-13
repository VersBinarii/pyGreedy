import logging


def setLogger(logfile="pyGreedy.log", progname="pyGreedy"):

    g_logger = logging.getLogger(progname)
    g_logger.setLevel(logging.INFO)

    # add handler
    file_handler = logging.FileHandler(logfile)
    file_handler.setLevel(logging.INFO)
    
    g_logger.addHandler(file_handler)

    return g_logger
    
