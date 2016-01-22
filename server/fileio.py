from config import *
import os.path


# checks to see if a file exists
def does_file_exist(filename):
    if not os.path.isfile(filename):
        return False


# gets the file contents prefixed with the config settings for the doc location
def get_file(filename):
    name = doc_loc + filename
    if os.path.isfile(name):
        with open(name, 'r') as myfile:
            data = myfile.read()
        return data
    else:
        return False


# save the file contents to the location in filename
def put_file(filename, contents):
    name = pdf_loc + filename
    with open(name, 'w') as myfile:
        myfile.write(contents)

