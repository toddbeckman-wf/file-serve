from config import *
import os.path


def getFile(filename):
    name = data_loc + filename
    if os.path.isfile(name):
        with open(name, 'r') as myfile:
            data = myfile.read()
        return data
    else:
        print('Could not find',filename)

def putFile(filename, contents):
    name = data_loc + filename
    with open(name, 'w') as myfile:
        myfile.write(contents)

somedata = getFile(raw_input('File name: '))
print(somedata)
putFile('moredata.txt',somedata)
