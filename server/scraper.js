'use strict';

const phantom = require('phantom');
const jq = require.resolve('jquery');
const bb = require.resolve('bluebird').replace('release/bluebird.js','browser/bluebird.min.js');
const tools = require.resolve('./scrapetools.js');
const fs = require('fs');
const {URL} = require('url');


var scraper = function(app){
	app.get('/scrape',function (req,res) {
		var dest = decodeURIComponent(req.query.url);
		dest = encodeURI(dest);
		var site = sitename(dest);
		var opt;
		if(site === 'flickr'){
			opt = []
		}else{
			opt = ['--load-images=no','--ignore-ssl-errors=yes']
		}
		//phantom.create(['--load-images=no']).then(function(browser){
		phantom.create(['--ignore-ssl-errors=yes']).then(function(browser){
			new scrape(dest,browser).then(function(data){
				res.send(data);
			},function(err){
				console.error('Error: '+err);
				res.send(err);
			})
		})
	})
}
function sitename(url){
	var site = new URL(url).hostname;
	site = site.split('.');
	site = site[site.length-2];
	return site;
}
function examine(res,url){
	if(res.error) return res;
	var html = '';
	var seen = {};
	res.images = res.images.filter(function(r){
		return (r.src && seen.hasOwnProperty(r.src)) ? false: (seen[r.src]  = true);
	})
	res.images.map(function(im){
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

function scrape(url,browser){
	var site = sitename(url);
	console.log(site)
	var self = this;
	return new Promise(async function(resolve,reject){
		try{
			var page = await browser.createPage();
			page.on('onConsoleMessage',function(msg) {
				console.log('CONSOLE: ' + msg);
			});
			page.on('onCallback',function(data) {
				if(data!=='error'){
					resolve(examine(data,url));
				}else{
					reject('error in scrape')
				}

				page.close().then(function(){
					console.log('page closed')
					browser.exit().then(function(){
						console.log('browser exit')
					});
				})
				/*
				page.property('content').then(function(html){
					fs.writeFileSync('test.html', html);
					browser.exit();
				},function(err){
					console.log(err);
				});
				*/
			},function(err){
				console.error('Error: '+err);
			});
			page.on('onInitialized',function(){
				page.injectJs(bb);
				page.injectJs(tools);
			});

			page.on('onLoadFinished',function(){
				if(self.init) return;
				self.init = true;
				console.log(site+' onLoadFinished')
				page.evaluate(function(){
					return window.jquery?true:false
				}).then(function(jquery){
					if(!jquery){
						page.injectJs(jq).then(function(){
							page.evaluate(function(site){
								try{
									jQuery.noConflict();
									imager_tools.scrape(site);
								}
								catch(err){
									console.error(err)
									window.callPhantom('error');
								}
							},site)
						});
					}else{
						page.evaluate(function(site){
							try{
								imager_tools.scrape(site);
							}
							catch(err){
								console.error(err)
								window.callPhantom('error');
							}
						},site)
					}
				});
			});
			var size;
			if(site === 'flickr'){
				size = {
					width: 1920,
					height: 1080
				}
			}else{
				size = {
					width: 1920,
					height: 20000
				}
			}
			await page.property('viewportSize', size);
			await page.setting('userAgent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');
			page.open(url).then(function(status){
				console.log('status:'+status);
			});

		} catch(err){
			reject(err);
		}
	})
}

module.exports = scraper;
