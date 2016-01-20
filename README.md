file-serve
==========

This program is intended to send and receive files.


Some thoughts:

The implementation thusfar only serves. I may switch to FTP such as ftpd.

It should be easy to communicate with a simple handshake protocol:

speaker | info
--------|-----
client  | request file
server  | provide get and put keys
client  | request get file
server  | send file
client  | request put file
server  | ready
client  | send file

