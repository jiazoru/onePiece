let Ut = require("./common");
const superagent = require('superagent')
require('superagent-charset')(superagent)
const cheerio = require('cheerio');
let request = require("request");
let chapterCount = "984"
let mhService = "http://www-mipengine-org.mipcdn.com/i/p3.manhuapan.com";
// https://www.fzdm.com/manhua/2/984/
function downLoadUrl({
    url,
    chapter,
    page
}) {
    return new Promise((reslove, reject) => {
        superagent.get(url).end(async (err, res) => {
            if (err) {
                console.log('错误');
                console.log(err);
            } else {
                let reg = /^[\s\S]*mhurl=\"(\d{4}\/\d{2}.*?(jpg|png))[\s\S]*$/;
                let imgUrl = res.text.replace(reg, '$1');
                console.log(url);
                console.log(`${mhService}/${imgUrl}`);
                let fileUrl = `./newData/${chapter}/${page}.jpg`;
                console.log(fileUrl);
                let r1 = await Ut.downImg({
                    url: `${mhService}/${imgUrl}`
                }, fileUrl);
                reslove(res);

            }
        });
    })
}

async function getImgUrl({
    chapter,
    page
}) {
    if (!page) {
        page = 0;
    }
    let url = `https://www.fzdm.com/manhua/2/${chapter}`;
    url += `//index_${page}.html`;
    let res = null;
    try {
        res = await downLoadUrl({
            url,
            chapter,
            page
        })
        if (res.text.indexOf('下一页') !== -1) {
            console.log('下一页');
            page += 1;
            getImgUrl({
                chapter,
                page
            });
        } else {
            console.log('上一章');
            chapter = chapter - 1;
            getImgUrl({
                chapter
            });
        }
    } catch (error) {
        console.log('downloadError');
        console.log(error);
    }

}

getImgUrl({
    chapter: chapterCount
});