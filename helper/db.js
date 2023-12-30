require('dotenv').config()
const mysql = require('mysql2/promise')
const myConnection= async(query)=>{
    const connection = await mysql.createConnection(process.env.DATABASE_URL)
    const [rows]= await connection.query(query);
    connection.end()
    return rows;
}

module.exports=myConnection;