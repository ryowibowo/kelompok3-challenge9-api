require('dotenv').config();
// module.exports={
//   "development": {
//     "username": process.env.DB_USERNAME,
//     "password": process.env.DB_PASSWORD,
//     "database": process.env.DB_NAME,
//     "host": process.env.DB_HOST,
//     "dialect": "postgres",
//     "dialectOptions": {
//       "ssl": {
//         "require":true,
//         "rejectUnauthorized":false
//       }
//     }
//   },
//   "test": {
//     "username": process.env.DB_USERNAME,
//     "password": process.env.DB_PASSWORD,
//     "database": process.env.DB_NAME,
//     "host": process.env.DB_HOST,
//     "dialect": "postgres",
//     "dialectOptions": {
//       "ssl": {
//         "require":true,
//         "rejectUnauthorized":false
//       }
//     }
//   },
//   "production": {
//     "username": process.env.DB_USERNAME,
//     "password": process.env.DB_PASSWORD,
//     "database": process.env.DB_NAME,
//     "host": process.env.DB_HOST,
//     "dialect": "postgres",
//     "dialectOptions": {
//       "ssl": {
//         "require":true,
//         "rejectUnauthorized":false
//       }
//     }
//   }
// }
module.exports = {

  development: {
    username: 'postgres',
    password: 'babehlo123',
    database: 'project1',
    host: 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: 'babehlo123',
    database: 'project1_test',
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: 'postgres',
    password: 'babehlo123',
    database: 'project1_production',
    host: 'localhost',
    dialect: 'postgres',
  },

};
