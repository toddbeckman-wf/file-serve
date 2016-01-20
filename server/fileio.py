from config import *
import os.path


# gets the file contents prefixed with the config settings for the doc location
def getfile(filename):
    name = doc_loc + filename
    if os.path.isfile(name):
        with open(name, 'r') as myfile:
            data = myfile.read()
        return data
    else:
        return False


def putfile(filename, contents):
    name = pdf_loc + filename
    with open(name, 'w') as myfile:
        myfile.write(contents)

