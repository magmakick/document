'use strict';

const aglio = require('aglio');
const fs = require('fs');

const options = {
    themeTemplate: './agilo_template/custom_side.jade'
};

const sourceFileDir = './apiDocs';
const exportFileDir = './convert_html';


function ConvertApibToHtml(sourceFilePath, fileName, exportFilePath) {
    let only_fileName = fileName.split('.')[0];
    return new Promise((resolve, reject)=>{
        aglio.renderFile(`${sourceFilePath}/${fileName}`, `${exportFilePath}/${only_fileName}.html`, options, (err, warnings)=>{
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}


return new Promise((resolve, reject)=>{
    //file read
    fs.readdir(sourceFileDir, (err, files)=>{
        if(err) {
            reject(err);
            return;
        }

        resolve(files);
    })
})
.then((files)=>{
    let targetFiles = [];
    const ptr = /.apib/;
    for(let row of files) {
        let isApib = ptr.test(row);
        if(isApib === true) {
            targetFiles.push(row);
        }
    }
    return Promise.resolve(targetFiles);
})
.then((targetFiles)=>{
    let promises = []
    for(let row of targetFiles) {
        promises.push(ConvertApibToHtml(sourceFileDir, row, exportFileDir));
    }
    return Promise.all(promises);
})
.then(()=>{
    console.log('convert finish');
    process.exit(0);
})