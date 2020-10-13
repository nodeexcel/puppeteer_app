const conn = require('../connection');
const json2csv = require('json2csv').parse;
const fs = require('fs');

let exportUserDetails = async (req, res, next) => {
    try {
        let no_of_users = req.params.no_of_users;
        conn.getConnection(async function (err, connection) {

            let queryToGetUsers = ` SELECT u.id, u.email AS emailId, count(*) as pagecount FROM users AS u LEFT JOIN pagelinks AS p ON (p.userId = u.id) GROUP BY u.id, u.email ORDER BY pagecount desc LIMIT ${no_of_users}`;
            connection.query(queryToGetUsers, async function (err, userData) {

                let userIds = userData.map(u => u.id);
                let useridQuotationRemoved = "'" + userIds.join("','") + "'";

                let queryToGetTimeStamp = `SELECT AVG(timestamp/1000) AS averageLoadingTime, MAX(timestamp/1000) AS maxLoadingTime, MIN(timestamp/1000) AS minLoadingTime, pagelink, count(*) as count from pagelinks where userid IN (${useridQuotationRemoved}) group by pagelink`;
                connection.query(queryToGetTimeStamp, async function (err, pageData) {
                    if (err) {
                        res.status(400).send({
                            success: 0, data: []
                        });
                    } else {
                        let filePath = `${__dirname}/../uploads/file.csv`;
                        let fields = ['averageLoadingTime', 'maxLoadingTime', 'minLoadingTime', 'pagelink', 'count'];
                        const csv = json2csv(pageData, fields);
                        // console.log(csv);
                        if (fs.existsSync(filePath))
                            fs.unlinkSync(filePath);
                        fs.writeFileSync(filePath, csv);
                        connection.release();
                        res.status(200).send({
                            success: 1, data: {
                                userData: userData,
                                pageData: pageData
                            }
                        });

                    }
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