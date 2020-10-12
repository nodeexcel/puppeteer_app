const conn = require('../connection');
const json2csv = require('json2csv').parse;
const fs = require('fs');

let exportUserDetails = async (req, res, next) => {
    try {
        let no_of_users = req.params.no_of_users;
        conn.getConnection(async function (err, connection) {

            let queryToGetUsers = `SELECT id FROM users limit ${no_of_users}`;
            connection.query(queryToGetUsers, async function (err, users) {

                let userIds = users.map(u => u.id);
                let useridQuotationRemoved = "'" + userIds.join("','") + "'";

                let queryToGetTimeStamp = `SELECT userid, AVG(timestamp) as averageTimestamp, pagelink from pagelinks where userid IN (${useridQuotationRemoved}) group by pagelink`;
                connection.query(queryToGetTimeStamp, async function (err, data) {
                
                    let filePath = `${__dirname}/../uploads/file.csv`;
                    let fields = ['userid', 'email', 'averagetimestamp', 'pagelink'];
                    const csv = json2csv(data, fields);
                    console.log(csv);
                    if (fs.existsSync(filePath))
                        fs.unlinkSync(filePath);
                    fs.writeFileSync(filePath, csv);
                    connection.release();
                    res.status(200).send({ success: 1, data: filePath });
                })
            })
        })
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    exportUserDetails: exportUserDetails
}