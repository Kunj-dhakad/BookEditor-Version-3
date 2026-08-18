// import mysql, { Connection } from 'mysql2/promise';

// let connection: Connection | null = null;

// export const dbConnection = async (): Promise<Connection> => {
//   if (connection) {
//     return connection;
//   }

//   try {
//     connection = await mysql.createConnection({
//       host: process.env.MYSQL_HOST,     
//       user: process.env.MYSQL_USER,       
//       password: process.env.MYSQL_PASSWORD, 
//       database: process.env.MYSQL_DATABASE, 
//     });

//     console.log('Database connected successfully');
//     return connection;
//   } catch (error) {
//     console.error('Database connection failed:', error);
//     throw new Error('Could not connect to the database');
//   }
// };


// import mysql, { Pool } from 'mysql2/promise';
// let pool: Pool | null = null;

// export const dbConnection = (): Pool => {
//   if (pool) {
//     return pool;
//   }

//   pool = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,      
//     queueLimit: 0,
//     enableKeepAlive: true,   
//     keepAliveInitialDelay: 10000,
//   });

//   console.log('MySQL pool created');
//   return pool;
// };


import mysql, { Connection } from "mysql2/promise";

let connection: Connection | null = null;

export const dbConnection = async (): Promise<Connection> => {
  if (connection) {
    return connection;
  }

  console.log("MYSQL_HOST =", process.env.MYSQL_HOST);
  console.log("MYSQL_USER =", process.env.MYSQL_USER);
  console.log("MYSQL_DATABASE =", process.env.MYSQL_DATABASE);
  console.log("MYSQL_PORT =", process.env.MYSQL_PORT);

  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    console.log("Database connected successfully");

    return connection;
  } catch (error) {
    console.error("Database connection failed:", error);
    connection = null;
    throw new Error("Could not connect to the database");
  }
};