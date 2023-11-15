# File-Manager
File Manager system using Node.js, Postgres and Amazon S3.

## Instructions for running

1. Clone this repository
   >git clone https://github.com/Microwiseto/File-Manager.git

2. Install node packages in File-Manager directory
   >npm install

3. Configure the config.js file to include your aws credentials
   >AWS_ACCESS_KEY_ID ='<Your_AWS_ACCESS_KEY_ID>';
   >AWS_SECRET_ACCESS_KEY ='<YOUR_AWS_SECRET_ACCESS_KEY>';

4. Have a running postgres server
  >user: 'postgres',
  >host: 'localhost',
  >database: 'postgres',
  >password: 'password',
  >port: 5432

5. Run the server using dev script
   >npm run dev

## Endpoints implemented

1. '/' - Get a list of users
2. '/user/register' - Register a new user
3. '/user/login' - Login using username and password
4. '/create/folder' - Create a folder
5. './create/subfolder' - Create a subfolder
6. './file/upload' - Upload a file to the S3 bucket
7. './file/delete' - Delete a file from the S3 bucket
8. './file/rename' - Rename a file

## Additional info

The help.txt file contains the JSON body examples for each request made at the endpoints 

