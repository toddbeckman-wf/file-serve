from fileio import *

import socket
import sys

import json

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sock.bind((loc, port))
sock.listen(0)
print('started server on port ',port)


# wraps file data into the JSON
def wrapfile(data):
    return "{'mode':'sent';'data':'"+data+"'}"


def success(msg):
    return "{'mode':'received';'msg':'"


# formats an error code into the proper JSON format for sending
def err(reason):
    return "{'mode':'err';'msg':'"+reason+"'}"


# determines if the provided json object provides the correct user and password
# this can be made into a more strict check in the future
def authenticated(request):
    if request and request.user and request.password and request.user == user and request.password == password:
        return True
    return False


while True:
    connection, client = sock.accept()
    try:
        data = connection.recv(4096)
        request = json.loads(data)
        if not authenticated(request):
            connection.send(err("Access denied."))
        # check for the existence of the file
        elif not request.file:
            connection.send(err("No 'file' specified."))
        # only accept requests with modes
        elif not request.mode:
            connection.send(err("No 'mode' specified. Options: get, put."))
        # handle the get
        elif request.mode == 'get':
            # load the requested file
            thefile = getfile(request.file)
            # make sure the file was found
            if not thefile:
                connection.send(err("The file "+request.file+" could not be found."))
            # the file was found! Send it over
            else:
                connection.send(wrapfile(request.file, getfile(request.file)))
        elif request.mode == 'put':
            if not request.data:
                connection.send(err("No 'data' specified."))
            else:
                putfile(request.file, request.data)
                connection.send(success(request.file+" saved successfully."))
        print(data)
    finally:
        connection.close()


