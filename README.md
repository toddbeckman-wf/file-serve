file-serve
==========

This program is intended to send and receive files.


Some thoughts:

The implementation thusfar only serves. I may switch to FTP such as ftpd.

Client requests a transaction:
- later: Server provides salt for authentication
- Client provides authentication
- Server provides keys

Client requests for file (JSON?):
- Client provides key: key (query.k)
- Server finds file associated with the key
- Server sends the requested file

Client requests to send file (JSON again probably)
- Client provides key (query.q)
- Server accepts connection
- Client sends file
- Server verifies proper storage and closes connection