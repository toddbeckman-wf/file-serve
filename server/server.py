from config import *
import os.path


def getFile(filename):
    name = data_loc + filename;
    if os.path.isfile(name):
        with open(name, 'r') as myfile:
            data = myfile.read()
        return data
    else:
        print('Could not find',filename)

print(getFile(raw_input('File name: ')))
