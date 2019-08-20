const fs = require('fs');
const path = require('path');

const count = require('../utils').count;

const writeToFile = (url_map, filename) => {
    
    const file_path = path.join(__dirname, '..', filename); 
    if(fs.existsSync(file_path) ) {
        fs.unlinkSync(file_path);
    }

    if(!Object.keys(url_map).length ) {
        console.log("No urls to dump");
        return;
    }
    
    let str = '';
    for(let url in url_map) {

        if(url_map[url]) {
            str += `${url},\n`;            
        }
    }

    fs.appendFileSync(filename, str );

    console.log(`File updated. Path: ${file_path}`);
}

const outputHandler = (url_map, filename, curr_url ) => {
    writeToFile(url_map, filename);
    console.log(`Current URL: ${curr_url}`);
    let count_data = count(url_map);
    console.log(`Crawled URLs: ${count_data.crawled}, Discovered URLs: ${count_data.discovered}`);
}

module.exports = {
    outputHandler
}