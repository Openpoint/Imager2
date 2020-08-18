'use strict';

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');
const tools = fs.readFileSync(require.resolve('./scrapetools.js')).toString();
const jquery = fs.readFileSync(require.resolve('jquery')).toString();
const {URL} = require('url');

console.log()


var scraper = function(app){
	app.get('/scrape',async (req,res) => {
		let dest = decodeURIComponent(req.query.url);
		dest = encodeURI(dest);
		const site = sitename(dest);
		const size = {width: 1920, height:20000, deviceScaleFactor: 3}
		if(site === 'flickr') size.height = 1080;
		let browser, data;
		try {
			browser = await puppeteer.launch({
				ignoreHTTPSErrors: true,
				defaultViewport: null,
				args: [
					`--window-size=${size.width},${size.height}`,
					`--cast-initial-screen-width=${size.width}`,
					`--cast-initial-screen-height=${size.height}`
				],
				headless: true,
			})
			data = await new scrape(dest,browser, size);
		}
		catch(err) {
			console.error('Error: '+err);
			return req.reject(err);
		}
		res.send(data);
	})
}
function sitename(url){
	var site = new URL(url).hostname;
	site = site.split('.');
	site = site[site.length-2];
	return site;
}
function examine(result,url){
	if(result.error) return result;
	var html = '';
	var seen = {};
	result.images = result.images.filter(image => {
		if(!image.src) return false;
		return (
			image.src && seen.hasOwnProperty(image.src)) ? false: (seen[image.src]  = true);
	})
	result.images.map(function(im){
		im.date = Date.now();
		return im;
	})
	var u = new URL(url);
	if(!result.favicon){
		result.favicon = u.origin+'/favicon.ico'
	}
	if(result.favicon.indexOf('://')===-1){
		if(result.favicon[0]!=='/') result.favicon = '/'+result.favicon;
		result.favicon = u.origin+result.favicon;
	}
	return result;
}
function googleDataFilter(data, images, parent = []){
	
	if(data.find(row => (
		typeof row === 'string' &&
		row.startsWith('http') &&
		row.indexOf('gstatic.com') < 0
	))){
		const image = {}
		parent
			.filter(row => (			
				Array.isArray(row) ? (
					!row.find(row => typeof row === 'string' && row.indexOf('gstatic.com') > -1)
				) : true &&
				!!row &&
				typeof row === 'object'
			))
			.forEach(row => {
				if(Array.isArray(row)) {
					image.src = row.find(row => (typeof row === 'string' && row.startsWith('http')))
				}
				if(row['2003']) {
					const data = row['2003'].filter(row => typeof row === 'string');
					image.page = data[1];
					image.alt = data[2];
				}
			})
		images.push(image);
		return 
	};
	data.forEach((row, i) => {
		if(Array.isArray(row)) googleDataFilter(row, images, data);
	})
}
function googleScrape(data){
	const images = [];
	data = Object.keys(data)
		.filter(key => Array.isArray(data[key]))
		.map(key => data[key]);
	googleDataFilter(data, images);
	fs.writeJsonSync('test.json', images, {spaces: 4})
	return images;
}

function scrape(url, browser, size){
	var self = this;
	return new Promise(async (resolve,reject) => {
		let page;
		const site = sitename(url);
		let gImages = [];
		try{
			page = await browser.newPage();
			await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36')
			page.on('console', msg => console.log('PAGE LOG:', msg.text()));
			await page.exposeFunction('scrapeResult', data => {
				browser.close();
				if(site === 'google') data.images = gImages;
				data.error ? reject(data) : resolve(examine(data,url));				
			});
			await page.exposeFunction('logTo', data => {
				console.log(data.data);
			});
			await page.exposeFunction('googleScrape', data => {
				let images = eval(data);
				gImages = gImages.concat(images);
			});					
			await page.goto(url);
			let hasJq = await page.evaluate(() => window.jQuery?true:false);
			if(!hasJq) await page.evaluate(`${jquery};jQuery.noConflict();`);
			await page.evaluate(tools);
			page.evaluate(`imager_tools.scrape('${site}')`);

		} catch(err){
			reject(err);
			browser.close();
		}
	})
}

module.exports = scraper;
