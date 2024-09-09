# cserver
The back-end service monitoring and processing all the data obtained  from both the mobile-app and the dashboard

## Table of contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Contact](#contact)
  
 ## Installation
clone the repository using
"git clone https://github.com/126jgvvb/cserver.git"
Copy this folder and navigate to the nodeJS enviroment folder and paste this folder

## Usage
 This system has 3 main routes eg.(/admin,/dashboard,/database).You can use postman to test these endpoint.Please note that admin routes may reject unencrypted data by triggering an error
## /admin
        (post)                                                                      (get)
        /create-another-user{name,password,deviceID,email,RefSigner}              /logout{name,password,ID}
        /signup{name,password,deviceID,email,RefSigner}                          /verificaton-code{username,clientCode,ID}
        /delete-account{username,ID}
        /change-password{username,newPassword,ID}
        /forgot-password{username,ID}

## /dashboard
        (post)                         (get)
        /admin-auth{id}                    /authenticated{id}
        /upload-file{ID}                   /load-page-data{id}
        /delete-file {ID}                  /download{path}


## /database
          (post)                    
         /backup{ID,Agents:[]}
         /getAgents{ID,date}

## Scripts
## To initiate the server,type the following command using node.exe found in the node directory
command: ".load cserver/main.js"

## Contacts
## For inquiries please feel free to contact me on the following links:
Email:wadikakevin@gmail.com
whatsapp: +256741882818












  
