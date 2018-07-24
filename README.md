# Project 2

Web Programming with Python and JavaScript

Description:
This web app is a messaging program that allows users to have a display name
and send messages to all who look at the site. It also gives the user the ability to
make new 'channels' or chat rooms that are added to the drop down menu if the channel
doesnt already exist. The user can see that name of who sent a specific message and the
time it was sent.

File Descriptions:

index.html - since this is a single page application, the only
html file used is this one, includes header and forms to make the web app work

index.js - includes what to do when buttons are pressed, the drop down menu is changed,
when the document loads, when socket.io emits or on something, and various functions to reduce repeating

application.py - all the functions for when a user submits information through a
form or "goes to" a certain url of the web app, contains Flask

design.css - makes a couple elements more aesthetically pleasing

requirements.txt -list of python packages that need to be installed in order to be able to run the web app

Note:
I have been trying to figure out for days now how to show the messages once a user
closes the application and reopens it. I have it to where it opens back up on the channel
the user was last at, however, it doesn't display that channel's previous messages. If you
take a look at the local storage variables, the messages are updated and stored there. Also,
the user can see messages from other users. Because the problem with reopening the tab with messages
arose after sections were held, I didn't get a chance to go and ask for help. I was following along
with the milestones and realized I couldn't complete the program the way I was doing it. So, I pretty
much started from scratch and I just couldn't get the messages to show after I redid what I had
set up before. I have run out of time to make it work. Because of this also, I couldn't complete the
'customization' requirement, because it branches from making the messages work.

The reason I can come up with is the error it's giving me when I refresh is that the button socket.io
is looking for doesn't exist. However it does, it's created when I render the channel that was in the
local variable as soon as the document loads. The only solution I can figure is to delay the socket.io's
initial connection, however I've looked it up and from what I understand you can only delay the reconnection.

I hope you can follow my comments and figure out what I was trying to do.