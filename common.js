let fs = require("fs");
let pathM = require("path");
var request = require('request');
var http = require('http');
var url = require('url');

class Ut {
    /**
     * 下载网络图片
     * @param {object} opts 
     */

    static getStat(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(stats);
                }
            })
        })
    }

    static mkdir(dir) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dir, err => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }
    static async dirExists(dir) {
        let isExists = await this.getStat(dir);
        //如果该路径且不是文件，返回true
        if (isExists && isExists.isDirectory()) {
            return true;
        } else if (isExists) { //如果该路径存在但是文件，返回false
            return false;
        }
        //如果该路径不存在
        let tempDir = pathM.parse(dir).dir; //拿到上级路径
        //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
        let status = await this.dirExists(tempDir);
        let mkdirStatus;
        if (status) {
            mkdirStatus = await this.mkdir(dir);
        }
        return mkdirStatus;
    }
    static downImg(opts = {}, path = '') {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                let arr = path.split('/');
                arr.pop();
                let dir = arr.join('/')
                await this.dirExists(dir)
                let writeStream = fs.createWriteStream(path);
                let readStream = request(opts.url);
                readStream.pipe(writeStream);
                readStream.on('end', function () {
                    readStream.end();
                    resolve("success");
                    // console.log(`文件下载成功${fileDownloadPath}`);
                });
                readStream.on('error', function (error) {
                    writeStream.end();
                    fs.unlinkSync(fileDownloadPath);
                    // console.log(`错误信息:${error}`);
                    // 下载失败的，重新下载TODO
                    readStream.end();
                    resolve("fail");
                    // setTimeout(() => {
                    //     bagpipe.push(downloadFile, imgPath, function (err, data) {});
                    // }, 5000);
                })
                writeStream.on("finish", function () {
                        readStream.end();
                        writeStream.end();
                    })
                    .on('error', function (err) {
                        readStream.end();
                        writeStream.end();
                        // console.log(`文件写入失败}`);
                    });
            }, 400)
        })
    };
}

module.exports = Ut;