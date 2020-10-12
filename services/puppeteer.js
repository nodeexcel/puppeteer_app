const puppeteer = require('puppeteer');
const conn = require('../connection');
require('dotenv').config()
const { uuid } = require('uuidv4');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
(async () => {
    conn.getConnection(async function (err, connection) {

        let queryToFindUser = `SELECT * from users`;
        connection.query(queryToFindUser, async function (err, data) {
            if (data && data.length) {
                data = data.splice(0, 10)

                for (let user of data) {
                    const browser = await puppeteer.launch({ headless: true, args: ["--disable-notifications"] });
                    const page = await browser.newPage();
                    await page.goto('http://company1.platoo.in/');
                    await page.focus('.form-group input[name=email]')
                    await page.keyboard.type(`${user.email}`)
                    await page.focus('.form-group input[name=password]')
                    await page.keyboard.type('123')
                    await page.click('button[type=submit]')
                    await page.waitForNavigation();
                    const selector = '.expo > a'
                    await page.waitForSelector(selector)
                    const links = await page.$$eval(selector, am => am.filter(e => e.href).map(e => e.href))
                    console.log(links);

                    recurssiveFunction(links, page, user, (err, data) => { });
                }
            } else {
                let queryToInsertUser = `INSERT INTO users (id, email) VALUES `;

                for (let i = 1; i <= 999; i++) {
                    let email = 'testing' + i + '@gmail.com'
                    if (i == 999) {
                        queryToInsertUser += `('${uuid()}', '${email}');`
                    } else {
                        queryToInsertUser += `('${uuid()}', '${email}'),`
                    }
                }
                connection.query(queryToInsertUser, async function (err, data) { })
            }
        })
    })
})();

async function recurssiveFunction(links, page, user, callback) {
    let exit = false;
    setTimeout(function () {
        exit = true;
        callback(null, "DDDDDDDDDDOOOOOOOOOOONNNNNNNNNNNEEEEEEEEEEE");
    }, 3660000);

    for (let i = 0; i < links.length; i++) {
        console.log(links[0]);
        await page.goto(links[0], { waitUntil: 'networkidle2' });
        let gitMetrics = await page.metrics();

        let insertUsersPageDetails = `INSERT INTO pagelinks (id, userid, pagelink, timestamp, email) VALUES ('${uuid()}', '${user.id}', '${links[0]}', '${gitMetrics.Timestamp}', '${user.email}')`
        conn.getConnection(async function (err, connection) {
            connection.query(insertUsersPageDetails, async function (err, data) {
                console.log(user.email);
            })
        })

        await sleep(10000);
        await page.click('.lobby-link')
        await sleep(10000);
        if (i == links.length - 1) {
            i = 0;
        }
        if (exit == true) {
            break;
        }
    }
}
