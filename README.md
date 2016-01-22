file-serve
==========

This program is intended to send and receive files.

It is incomplete. It was previously tested to function perfectly for serving files.
However, that functionality is no longer guaranteed due to some changes. This program
might function as intended, but has not been tested at all.

Current dependencies:
- body-parser (allows POST messages to be parsed)
- debug (allows error handling)
- ejs (allows live-generated webpages)
- express (the server)
- multer (handles file uploads)

Client requests a transaction:
- later: Server provides salt for authentication
- Client provides authentication
- Server provides keys

Client requests for file (JSON?):
- Client provides key for get
- Server finds file associated with the key
- Server sends the requested file

Client requests to send file (JSON again probably)
- Client provides key for put
- Server directs to upload page
- Client sends file
- Server verifies proper storage and closes connection