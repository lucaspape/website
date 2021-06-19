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
  const CREATE_POSTS_TABLE = 'CREATE TABLE IF NOT EXISTS `' + DBNAME + '`.`posts` (`id` VARCHAR(36), `timestamp` TIMESTAMP, `author` TEXT, `content_type` TEXT, `content` TEXT, PRIMARY KEY(`id`))';

  const CREATE_USERS_TABLE = 'CREATE TABLE IF NOT EXISTS `' + DBNAME + '`.`users` (`id` VARCHAR(36), `name` TEXT, `password` TEXT, `permissions` TEXT, PRIMARY KEY(`id`), UNIQUE KEY(`name`))';

  const CREATE_SESSION_TABLE = 'CREATE TABLE IF NOT EXISTS `' + DBNAME + '`.`sessions` (`id` VARCHAR(36), `username` TEXT, PRIMARY KEY(`id`))';

  mysqlConnection.query(CREATE_POSTS_TABLE, (err, result) => {
    if(err){
      callback(err);
    }else{
        mysqlConnection.query(CREATE_USERS_TABLE, (err, result) => {
          if(err){
            callback(err);
          }else{
            mysqlConnection.query(CREATE_SESSION_TABLE, (err, result) => {
              callback(err);
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

  getPosts: function(skip, limit, callback){
    const POSTS_QUERY = 'SELECT * FROM `' + DBNAME + '`.`posts` ORDER BY timestamp DESC LIMIT ' + mysqlConnection.escape(skip) + ', ' + mysqlConnection.escape(limit) + ';';

    mysqlConnection.query(POSTS_QUERY, callback);
  },

  insertPost: function(author, content_type, content, callback){
    const ID = uuidv4();

    const INSERT_POST_QUERY = 'INSERT INTO `' + DBNAME + '`.`posts` (id, author, content_type, content) values ("' + ID + '","' + author + '","' + content_type + '","' + content + '");';

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
  }
};
