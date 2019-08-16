const count = (url_map) => {
    let crawled = 0; //crawled urls
    let discovered = 0; //discovered url but not crawled

    for(let url in url_map) {
        if(url_map[url]) {
            crawled++;
        } else {
            discovered++;
        }
    }

    return {
        crawled,
        discovered
    }
}

const regexMatcher = (url) => {

    //to be developed further
    return (url.indexOf(process.env.DOMAIN) === 0 && 
    !url.includes('?') &&
    url.indexOf('.') === 14 && 
    !url.includes('&') );
}

const addPrefixer = (url) => {
    if(url.indexOf('/medium.com') === 0) {
        return `https:/${url}`;
    } else if(url.indexOf('/') === 0) {
        return `https://medium.com${url}`;
    } else {
        return url;
    }    
}

module.exports = {
    addPrefixer,
    regexMatcher,
    count
}