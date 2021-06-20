const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');

const DBNAME = 'database';

const mysqlConnection = mysql.createConnection({
    host: 'mariadb',
    user: 'root',
    password: 'password',
    database: DBNAME
  });

function createTables(callback){
  const CREATE_POSTS_TABLE = 'CREATE TABLE IF NOT EXISTS `' + DBNAME + '`.`posts` (`id` VARCHAR(36), `pageId` TEXT, `timestamp` TIMESTAMP, `author` TEXT, `content_type` TEXT, `content` TEXT, PRIMARY KEY(`id`))';

  const CREATE_USERS_TABLE = 'CREATE TABLE IF NOT EXISTS `' + DBNAME + '`.`users` (`id` VARCHAR(36), `name` TEXT, `password` TEXT, `permissions` TEXT, PRIMARY KEY(`id`), UNIQUE KEY(`name`))';

  const CREATE_SESSION_TABLE = 'CREATE TABLE IF NOT EXISTS `' + DBNAME + '`.`sessions` (`id` VARCHAR(36), `username` TEXT, PRIMARY KEY(`id`))';

  const CREATE_PAGES_TABLE = 'CREATE TABLE IF NOT EXISTS `' + DBNAME + '`.`pages` (`id` VARCHAR(36), `uri` TEXT, `name` TEXT, PRIMARY KEY(`id`))';

  mysqlConnection.query(CREATE_POSTS_TABLE, (err, result) => {
    if(err){
      callback(err);
    }else{
        mysqlConnection.query(CREATE_USERS_TABLE, (err, result) => {
          if(err){
            callback(err);
          }else{
            mysqlConnection.query(CREATE_SESSION_TABLE, (err, result) => {
              if(err){
                callback(err);
              }else{
                mysqlConnection.query(CREATE_PAGES_TABLE, (err, result) => {
                  callback(err);
                });
              }
            });
          }
        });
    }
  });
}

module.exports = {
  connect: function(callback){
    mysqlConnection.connect((err) => {
      if(err){
        callback(err);
      }else{
        createTables(callback);
      }
    });
  },

  getPosts: function(pageId, skip, limit, callback){
    const POSTS_QUERY = 'SELECT * FROM `' + DBNAME + '`.`posts` WHERE pageId = "' + pageId + '" ORDER BY timestamp DESC LIMIT ' + mysqlConnection.escape(skip) + ', ' + mysqlConnection.escape(limit) + ';';

    mysqlConnection.query(POSTS_QUERY, callback);
  },

  insertPost: function(pageId, author, content_type, content, callback){
    const ID = uuidv4();

    const INSERT_POST_QUERY = 'INSERT INTO `' + DBNAME + '`.`posts` (id, pageId, author, content_type, content) values ("' + ID + '","' + pageId + '","' + author + '","' + content_type + '","' + content + '");';

    mysqlConnection.query(INSERT_POST_QUERY, callback);
  },

  login: function(username, password, callback){
    const USER_QUERY = 'SELECT * FROM `' + DBNAME + '`.`users` WHERE name = "' + username + '";';

    mysqlConnection.query(USER_QUERY, (err, result) => {
      if(err){
        callback(err, undefined);
      }else{
        if(result[0]){
          if(result[0].password == password){
            const sid = uuidv4();

            const INSERT_SESSION_QUERY = 'INSERT INTO `' + DBNAME + '`.`sessions` (id, username) values ("' + sid + '", "' + username + '");';

            mysqlConnection.query(INSERT_SESSION_QUERY, (err, result) => {
              if(err){
                callback(err, undefined);
              }else{
                callback(undefined, {sid: sid});
              }
            });
          }else{
            callback('password wrong', undefined);
          }
        }else{
          callback('user not found', undefined);
        }
      }
    });
  },

  register: function(username, password, callback){
    const USER_QUERY = 'SELECT * FROM `' + DBNAME + '`.`users` WHERE name = "' + username + '";';

    mysqlConnection.query(USER_QUERY, (err, result) => {
      if(err){
        callback(err, undefined);
      }else{
        if(!result[0]){
          const id = uuidv4();
          var permissions = '';

          if(username == 'admin'){
              permissions = 'create_post';
          }

          const INSERT_USER_QUERY = 'INSERT INTO `' + DBNAME + '`.`users` (id, name, password, permissions) values ("' + id + '","' + username + '","' + password + '","' + permissions + '");';

          mysqlConnection.query(INSERT_USER_QUERY, callback);
        }else{
          callback("user already exists", undefined);
        }
      }
    });
  },

  checkPermissions: function(sid, callback){
    const SESSION_QUERY = 'SELECT * FROM `' + DBNAME + '`.`sessions` WHERE id = "' + sid + '";';

    mysqlConnection.query(SESSION_QUERY, (err, result) => {
      if(err){
        callback(err, undefined);
      }else{
        if(result[0]){
          const USER_QUERY = 'SELECT * FROM `' + DBNAME + '`.`users` WHERE name = "' + result[0].username + '";';

           mysqlConnection.query(USER_QUERY, (err, result) => {
             if(err){
               callback(err, undefined);
             }else{
               if(result[0]){
                 callback(undefined, result[0].permissions.split(','));
               }else{
                 callback('Could not find user', undefined);
               }
             }
           });
        }else{
          callback(undefined, []);
        }
      }
    });
  },

  getUser: function(sid, callback){
    const SESSION_QUERY = 'SELECT * FROM `' + DBNAME + '`.`sessions` WHERE id = "' + sid + '";';

    mysqlConnection.query(SESSION_QUERY, (err, result) => {
      if(err){
        callback(err, undefined);
      }else{
        if(result[0]){
          const USER_QUERY = 'SELECT id, name, password, permissions FROM `' + DBNAME + '`.`users` WHERE name = "' + result[0].username + '";';

           mysqlConnection.query(USER_QUERY, (err, result) => {
             if(err){
               callback(err, undefined);
             }else{
               if(result[0]){
                 callback(undefined, result[0]);
               }else{
                 callback('Could not find user', undefined);
               }
             }
           });
        }else{
          callback(undefined, []);
        }
      }
    });
  },

  getPages: function(skip, limit, callback){
    const PAGES_QUERY = 'SELECT * FROM `' + DBNAME + '`.`pages` LIMIT ' + mysqlConnection.escape(skip) + ', ' + mysqlConnection.escape(limit) + ';';

    mysqlConnection.query(PAGES_QUERY, callback);
  },

  insertPage: function(uri, name, callback){
    const ID = uuidv4();

    const INSERT_PAGE_QUERY = 'INSERT INTO `' + DBNAME + '`.`pages` (id, uri, name) values ("' + ID + '","' + uri + '","' + name + '");';

    mysqlConnection.query(INSERT_PAGE_QUERY, callback);
  },

  deletePage: function(pageId, callback){
    const DELETE_PAGE_QUERY = 'DELETE FROM `' + DBNAME + '`.`pages` WHERE id = "' + pageId + '";';

    mysqlConnection.query(DELETE_PAGE_QUERY, callback);
  }
};
