import express from 'express';
import crypto from 'crypto';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../config.js'
import '../db/db.js';
import * as db from '../db/query.js';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        accessKeyId: AWS_ACCESS_KEY_ID
      }
    });

const router = express.Router();

export const getUsers = async (req, res) => {
    try{
        const response = await db.query('SELECT * FROM users');
        res.status(200).json(response.rows);
    } catch(err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}

export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try{
        const mykey = crypto.createCipher('aes-128-cbc', 'password');
        let mystr = mykey.update(password, 'utf8', 'hex')
        mystr += mykey.final('hex');
        const result = await db.query("INSERT INTO users(username, email, password) VALUES ($1, $2, $3)", [username, email, mystr]);

        res.status(201).json({
            message: 'User Added Successfully',
            body:{
                user:{username,email}
            }
        });
    } catch(err) {
        res.status(401).json({ message: 'User already exists' });
    }
}

export const loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    try{
        const mykey = crypto.createCipher('aes-128-cbc', 'password');
        let mystr = mykey.update(password, 'utf8', 'hex')
        mystr += mykey.final('hex');
        const result = await db.query("SELECT username FROM users WHERE username = $1 AND password = $2", [username, mystr]);
        if(result.rows.length === 1){
            res.status(200).json({message: 'Login Successful'});
            global.user = username;
        }
        else{
            res.status(401).json({message: 'Incorrect username or password'});
        }
    } catch(err) {
        res.status(404).json({message: err});
    }
}

export const createFolder = async(req, res, next) => {
    const { folder } = req.body;
    try{
        const folderExists = await db.query("SELECT username FROM folders WHERE folder = $1", [folder]);
        // if(folderExists.rows.length === 1 ){
        //     res.json({message: "Folder created"});
        // }else{
        const result = await db.query("INSERT INTO folders(username, folder) VALUES ($1 , $2)",[global.user, folder]);
        res.status(200).json({message: "Folder created"});
    } catch(err){
        res.status(404).json({message: err});
    }
}

export const createSubfolder = async(req ,res, next) => {
    const { folder, subfolder } = req.body;
    try{
        const folderOwner = await db.query("SELECT username FROM folders WHERE folder = $1", [folder]);
        if(folderOwner.rows[0].username === global.user){
            const result = await db.query("INSERT INTO folders(username, folder, subfolder) VALUES ($1 ,$2, $3)",[global.user, folder, subfolder]);
            res.status(200).json({message: "Subfolder created"});
        }
    } catch(err) {
        res.status(401).json({message: "Not authorized"});
    }
}

export const fileUpload = async(req, res, next) => {
    const { folder, subfolder, file, contents } = req.body;
    try{
        const folderOwner = await db.query("SELECT username FROM folders WHERE folder = $1", [folder]);
        if(folderOwner.rows[0].username === global.user){
            const result = await db.query("INSERT INTO folders(username, folder, subfolder, file) VALUES ($1 ,$2, $3, $4)",[global.user, folder, subfolder, file]);
            
            const command = new PutObjectCommand({
                Bucket: "ayushtomerawsbucket",
                Key: file,
                Body: contents,
            });
            
            try {
                const response = await s3client.send(command);
                const reqdata =  await s3client.send(new GetObjectCommand({
                    Bucket: "ayushtomerawsbucket",
                    Key: file
                }));
                
                const result = await db.query("INSERT INTO metadata(fileName, size, uploadDate) VALUES ($1, $2, $3)", [file, reqdata.ContentLength, reqdata.LastModified]);
            } catch (err) {
                console.error(err);
            }
            res.status(201).json({message: "File uploaded"});
        } else {
            res.status(401).json({message: "Not authorized"});
        }
    } catch(err) {
        res.status(400).json({message: err});
    }
}

export const fileDelete = async(req, res, next) => {
    const { folder, subfolder, file } = req.body;
    try{
        const fileOwner = await db.query("SELECT username FROM folders WHERE file = $1", [file]);
        if(fileOwner.rows[0].username === global.user){
            const result = await db.query("DELETE FROM folders WHERE file = $1",[file]);

            const command = new DeleteObjectCommand({
                Bucket: "ayushtomerawsbucket",
                Key: file,
            });
            try {
                const response = await s3client.send(command);
                console.log(response);
            } catch (err) {
                console.error(err);
            }
            res.status(200).json({message: "File deleted"});
        }else{
            res.status(401).json({message: "Not authorized"});
        }
    } catch(err) {
        res.status(404).json({message: err});
    }
}

export const fileRename =  async(req, res, next) => {
    const { folder, subfolder, oldfile, newfile } = req.body;
    try{
        const fileOwner = await db.query("SELECT username FROM folders WHERE file = $1", [oldfile]);
        if(fileOwner.rows[0].username === global.user){
            const result = await db.query("UPDATE folders SET file = $1 WHERE file = $2",[newfile, oldfile]);
            res.status(200).json({message: "File renamed"});
        }else{
            res.status(401).json({message: "Not authorized"});
        }
    } catch(err) {
        res.status(404).json({message: err});
    }
}

