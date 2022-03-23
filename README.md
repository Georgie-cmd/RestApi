# About project

RestAPI project. Service of registration, login, logout, authorization, data changing (password), token refreshing, user's deleting and mails.
___


## What do you need to do before?
>Create your Mongodb cluster and copy the link and paste to .env file, create your Gmail. Log in to your Gmail account, go to settings -> POP/IMAP -> turn on IMAP -> go to Details... (it is to the left of IMAP) -> go to SMTP and remember SMTP host and port (in .env I filled everything for you) after that you may need to allow insecure apps to access your account (u will see it on the same page about SMTP).

>About SMTP_USER and PASSWORD - fill your gmail and password

___


# How to install and launch it?

>$ npm install 

>$ npm run start:dev
___


># How does it work?
>>So RestAPI works with Mongodb; with **/registration** you should fill 2 fields with email and password - simple, after that you will receive some data with: refresh token, access token, IP address (ipv4) and it returns some dto data about the user. In Mongodb u will see 2 tabs: one for tokens, one for users, where your data will be. And dont forget to check your Gmail, cause there will be a message with activation link to my instagram :blue_heart: after clicking on the link you will activate your account (in Mongodb you will see boolean true in the field 'isActivated')
___
>>About **/login** fill 2 fields with your email and password and you will receive the same like with registration. And this request will send a mail to your Gmail about login
___
>>With **/logout** you should paste your access token and with this action you will remove your refresh token from 'tokens' tab.
___
>>With **/change** you can change your password, so that request includes 2 fields: your email and new password, but before this action u should paste access token, after successfull opeation you will receive tokens and some dto info, and the mail about updating.
___
>>With **/delete** you should paste your access token and to the body paste your account id and u will delete yourself

>>>You can send these requests with Postman program or you can open the requests.rest file and send with it
___


# Stack
**Node.js Express.js Mongodb**

