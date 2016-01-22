from fileio import *

import socket
import json
import hashlib
import keyhandler

hashed_pass = hashlib.sha224(password)

kh = keyhandler.KeyHandler()

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sock.bind((loc, port))
sock.listen(0)
print('started server on port ', port)


# wraps file data into the JSON
def wrapfile(data):
    return "{'mode':'sent';'data':'"+data+"'}"


# wraps a received message into the JSON
def success(msg):
    return "{'mode':'received';'msg':'"+msg+"'}"


# formats an error code into the proper JSON format for sending
def err(reason):
    print("Error: ", reason)
    return "{'mode':'err';'msg':'"+reason+"'}"


# determines if the provided json object provides the correct user and password
# this can be made into a more strict check in the future
def authenticated(request):
    if request and request.user and request.password and request.user == user and request.password == hashed_pass:
        return True
    return False


while True:
    connection, client = sock.accept()
    try:
        data = connection.recv(4096)
        request = json.loads(data)

        # make sure this exchange is legal
        if not authenticated(request):
            connection.send(err("Access denied."))
        elif request.mode is None:
            connection.send(err("No 'mode' specified. Options: req, get, put."))

        # start a new request
        elif request.mode == 'req':
            # make sure there's a file requested
            if request.file is None:
                connection.send(err("No 'file' specified."))
            elif not does_file_exist(doc_loc + request.file):
                connection.send(err("That file does not exist."))
            else:
                # send the key and the callback
                response = json.dumps({
                    'mode': 'req',
                    'key': kh.assign_key(request.name),
                    'callback': kh.assign_key('none')
                })
                connection.send(response)
                print ("Sent: ",response)

        # handle the get
        elif request.mode == 'get':
            if request.key is None:
                connection.send(err("No 'key' specified."))
            else:
                filename = kh.dict[request.key]

                # load the requested file
                thefile = get_file(request.file)

                # make sure the file was found -- should not happen
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
        else:
            connection.err("Invalid 'mode' specified. Options: get, put.")
    finally:
        connection.close()


