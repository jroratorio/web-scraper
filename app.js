require('dotenv').config();
const cheerio = require('cheerio');

const retrievePages = require('./connection').retrievePages;
const requestChunker = require('./connection').requestChunker;

const count = require('./utils').count;
const regexMatcher = require('./utils').regexMatcher;
const addPrefixer = require('./utils').addPrefixer;

const outputHandler = require('./output').outputHandler;

const scraper = async (url, url_map, filename) => {    

    if(url && !url_map.hasOwnProperty(url)) {
        url_map[url] = false;
    }

    let _chunked = requestChunker(url_map);

    for(let each_batch of _chunked) {           

        let _res = null;
        try {
            _res = await retrievePages(each_batch);
        } catch(err) {
            // console.log(err);
            continue;
        }            

        let pages = _res.pages;
        let _pages = _res._pages;

        for(let index in pages) {

            let $ = cheerio.load(pages[index]);
            let curr_url = _pages[index].href;

            $('a').each((i, elem) => {

                let node_url = elem && elem.attribs && elem.attribs.href ? elem.attribs.href : ''; 

                node_url = addPrefixer(node_url);

                if(node_url && regexMatcher(node_url) && !url_map.hasOwnProperty(node_url)) {
                    url_map[node_url] = false; //new links discovered added to url map 
                }                
            });

            if(url_map.hasOwnProperty(curr_url) && !url_map[curr_url] ) {
                url_map[curr_url] = true; //current page crawled
                outputHandler(url_map, filename, curr_url);
            }                
        }        
    }        

    if(count(url_map).discovered) {
        scraper('', url_map, filename);    
    }         
}

scraper(process.env.DOMAIN, {}, process.env.FILENAME);
