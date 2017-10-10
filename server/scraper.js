'use strict';

const phantom = require('phantom');
const jq = require.resolve('jquery');
const tools = require.resolve('./scrapetools.js');
const fs = require('fs');
const {URL} = require('url');


var scraper = function(app){
	app.get('/scrape',function (req,res) {
		var dest = decodeURIComponent(req.query.url);
		phantom.create(['--load-images=no']).then(function(browser){
			scrape(dest,browser).then(function(data){
				res.send(data);
			},function(err){
				console.log(err);
				res.send(err);
			})
		})
	})
}

function examine(res,url){
	if(res.error) return res;
	var html = '';
	var seen = {};
	res.images = res.images.filter(function(r){
		return (r.src && seen.hasOwnProperty(r.src)) ? false: (seen[r.src]  = true);
	})
	res.images.map(function(im){
		if(im.src.indexOf('url(')===0){
			im.src = im.src.slice(0, -1).replace('url(','').trim();
		}
		im.date = Date.now();
		return im;
	})
	var u = new URL(url);
	if(!res.favicon){
		res.favicon = u.origin+'/favicon.ico'
	}
	if(res.favicon.indexOf('://')===-1){
		if(res.favicon[0]!=='/') res.favicon = '/'+res.favicon;
		res.favicon = u.origin+res.favicon;
	}
	return res;
}

function sleep(ms){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			resolve(true);
		},ms)
	})
}

function scrape(url,browser){
	console.log(url);
	return new Promise(async function(resolve,reject){
		try{
			var page = await browser.createPage();
			page.property('onConsoleMessage',function(msg, lineNum, sourceId) {
				console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
			});
			await page.property('viewportSize', {
				width: 1800,
				height: 20000
			});
			await page.setting('userAgent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');
			await page.open(url);
			await page.onLoadFinished;

			await sleep(1000);
			//await page.render('/home/michaeladmin/test.jpeg');
			await page.injectJs(tools);
			var result = await page.evaluate(function(){
				var foo = [];
				if(typeof window.jQuery === 'undefined'){
					return false;
				}else{
					return imager_tools.scrape();
				}
			});

			if(result){
				proceed(result,url,resolve);

			}else{
				console.log('No Jquery')
				await page.injectJs(jq);
				//await page.onLoadFinished;
				result = await page.evaluate(function(){
					return imager_tools.scrape();
				})
				if(result){
					proceed(result,url,resolve);
				}else{
					reject('no result')
				}
			}

			var html = await page.property('content');
			fs.writeFileSync('test.html', html);
			browser.exit();

		} catch(err){
			reject(err);
		}
	})
}
function proceed(result,url,resolve){
	//console.log(result.frames);
	//todo: recurse into iframe embeds
	resolve(examine(result,url));
}
module.exports = scraper;
