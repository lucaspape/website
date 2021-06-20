const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = 80;
const PREFIX = '/lucaspape/';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({origin: ['https://api.lucaspape.de', 'https://testing.lucaspape.de'], credentials: true}));

const database = require('./database.js');
database.connect((err)=>{
    if(err){
      console.log(err);
    }else{
      app.get(PREFIX, (req, res) => {
        res.send('Hello World');
      });

      app.get(PREFIX + 'posts/:pageId', (req, res) => {
        const pageId = req.params.pageId;
        var {skip, limit} = req.query;

        if(!skip){
          skip = 0;
        }else{
          skip = parseInt(skip);
        }

        if(!limit){
          limit = 50;
        }else{
          limit = parseInt(limit);
        }

        database.getPosts(pageId, skip,limit, (err, results) => {
          if(err){
            console.log(err);

            res.status(500).send("Internal Server Error");
          }else{
            res.send(
              {
                results: results
              }
            );
          }
        });
      });

      app.post(PREFIX + 'posts/:pageId', (req, res) => {
        database.checkPermissions(req.cookies.sid, (err, result) => {
          if(err){
            res.status(500).send("Internal Server Error");
          }else if(result.includes('create_post')){
            database.insertPost(req.params.pageId, req.body.author, req.body.content_type, req.body.content, (err,result) => {
              if(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
              }else{
                res.send('Success');
              }
            });
          }else{
            res.status(500).send("No Permission");
          }
        });
      });

      app.get(PREFIX + 'user', (req, res) => {
        database.getUser(req.cookies.sid, (err, result) => {
          if(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
          }else{
            res.send({results: result});
          }
        });
      });

      app.post(PREFIX + 'user/login', (req, res) => {
        database.login(req.body.username, req.body.password, (err, result)=>{
          if(err){
            console.log(err);

            res.status(500).send("Internal Server Error");
          }else{
            res.cookie('sid', result.sid, {maxAge: 900000, httpOnly:true}).send('Success');
          }
        });
      });

      app.post(PREFIX + 'user/register', (req, res) => {
        database.register(req.body.username, req.body.password, (err, result)=>{
          if(err){
            console.log(err);

            res.status(500).send("Internal Server Error");
          }else{
            res.send(result);
          }
        });
      });

      app.get(PREFIX + 'pages', (req, res) => {
        var {skip, limit} = req.query;

        if(!skip){
          skip = 0;
        }else{
          skip = parseInt(skip);
        }

        if(!limit){
          limit = 50;
        }else{
          limit = parseInt(limit);
        }

        database.getPages(skip,limit, (err, results) => {
          if(err){
            console.log(err);

            res.status(500).send("Internal Server Error");
          }else{
            res.send(
              {
                results: results
              }
            );
          }
        });
      });

      app.post(PREFIX + 'pages', (req, res) => {
        database.checkPermissions(req.cookies.sid, (err, result) => {
          if(err){
            res.status(500).send("Internal Server Error");
          }else if(result.includes('create_post')){
            database.insertPage(req.body.uri, req.body.name, (err,result) => {
              if(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
              }else{
                res.send('Success');
              }
            });
          }else{
            res.status(500).send("No Permission");
          }
        });
      });

      app.delete(PREFIX + 'pages/:pageId', (req, res) => {
        database.checkPermissions(req.cookies.sid, (err, result) => {
          if(err){
            res.status(500).send("Internal Server Error");
          }else if(result.includes('create_post')){
            database.deletePage(req.params.pageId, (err,result) => {
              if(err){
                console.log(err);
                res.status(500).send("Internal Server Error");
              }else{
                res.send('Success');
              }
            });
          }else{
            res.status(500).send("No Permission");
          }
        });
      });

      app.listen(PORT, () => {
        console.log('Server started on port ' + PORT);
      });
    }
});
