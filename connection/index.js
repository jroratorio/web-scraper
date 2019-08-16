const rp = require('request-promise');

const retrievePages = (each_batch) => {

    const interval = process.env.INTERVAL && !isNaN(process.env.INTERVAL) ? parseInt(process.env.INTERVAL) : 5000;

    return new Promise((resolve, reject) => {
        
        setTimeout(async () => {

            try {
                //retrieve each url HTML
                let _pages = [];
                for(let each_url of each_batch) {
                    const opts = {
                        url    : each_url,
                        method : 'GET'
                    }
                    _pages.push(rp(opts));
                }

                let pages = await Promise.all(_pages);

                resolve({
                    pages,
                    _pages
                });

            } catch(err) {
                reject(err);
            }                   

        }, interval);
    });
}    

const requestChunker = (url_map) => {

    const simultaneous_requests = process.env.SIMULTANEOUS_REQUESTS && !isNaN(process.env.SIMULTANEOUS_REQUESTS) ? parseInt(process.env.SIMULTANEOUS_REQUESTS) : 5;

    let res = [];

    let bucket = [];

    let count = 1;
    for(let url in url_map) {

        // if the url is uncrawled but discovered
        if(!url_map[url]) {
            if(count <= simultaneous_requests) {
                bucket.push(url);
                count++;               
            } else {
                count = 0;
                res.push(bucket);
                bucket = [];
            }
        }       
    }

    if(bucket.length) {
        res.push(bucket);
    }
    return res;
}

module.exports = {
    retrievePages,
    requestChunker
}