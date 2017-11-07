import React, { Component } from 'react';
import {XMasonry,XBlock} from "react-xmasonry/dist/index.js"
import {Image} from './Image.js';
import crud from '../../modules/crud.js';
import tools from '../../modules/tools.js';

export class ImageList extends Component {

	constructor(props){
		super(props);
		var self = this;
		this.G = this.props.Global;

		this.deleteSingle = this.deleteSingle.bind(this);
		this.G('deleteSingle',this.deleteSingle);
		this.toFront = this.toFront.bind(this);
		this.G('toFront',this.toFront);
		this.imload = this.imload.bind(this);
		this.lazygo = this.lazygo.bind(this);
		this.queue = this.queue.bind(this);
		this.canvas = this.canvas.bind(this);
		this.blocks = this.blocks.bind(this);
		this.save = this.save.bind(this);
		this.exit = this.exit.bind(this);
		this.G('exit',this.exit);
		this.state = {
			loggedin:this.G('state').loggedin,
			trigger:false
		};
		this.p={};
		this.timeouts = {
			qpace:100
		};
		this.ims = {};
		this.xblocks = {};
		this.q = [];
		this.oldy = 0;
		this.batch = 10;
		//this.ready = false;
		this.scrolldir = 'down';
		this.rangesize = 200;
		this.range={
			bottom:0,
			top:this.rangesize
		}

		window.addEventListener('scroll',this.imload);

		this.images = this.G('page').images.filter(function(im){
			return !im.deleted
		})
		this.G('imonload',function(image){
			//console.warn(trigger,image.props.image.index)
			clearTimeout(self.timeouts[image.props.image.index])
			if(image.finished || image.out) return;
			image.finished = true;
			self.batch++;
			self.canvas(image);
			clearTimeout(self.timeouts.q)
			self.timeouts.q = setTimeout(function(){
				self.queue();
			},self.timeouts.qpace)

			image.setState({
				loaded:'loaded'
			});
		})
		this.G('imonerror',function(image){
			//console.error('error');
			clearTimeout(self.timeouts[image.props.image.index])
			if(image.finished || image.out) return;
			image.finished = true;
			self.batch++;
			clearTimeout(self.timeouts.q)
			self.timeouts.q = setTimeout(function(){
				self.queue();
			},self.timeouts.qpace)
			image.setState({
				loaded:'error',
				load:false
			});
		})
	}
	//put an image to canvas
	canvas(image){
		var width = Math.round(document.getElementById('wall').offsetWidth/40*image.props.w);
		var height = Math.round(width/image.props.image.ratio);
		image.canvas.width = width;
		image.canvas.height = height;
		image.ctx = image.canvas.getContext("2d");
		image.ctx.drawImage(image.image,0,0,width,height);
	}
	//check for when masonary has finished the layout and knows all the elements sizes and positions,all images are ready to be loaded
	blocks(){
		var self = this;
		var  l = Object.keys(self.xMasonry.state.blocks).length;
		var l2 = Object.keys(this.ims).filter(function(key){
			return self.ims[key]?true:false
		});
		l2 = l2.length;
		if(!l2||!l||l!==this.images.length){
			this.timeouts.bto = setTimeout(function(){
				self.blocks()
			},100)
		}else{
			//this.ready = true;
			this.lazygo();
		}
	}
	//The timed scroll trigger handler for window onscroll
	imload(){
		var diff;
		clearTimeout(this.timeouts.to);
		diff = window.scrollY-this.oldy;
		window.scrollY > this.oldy?this.scrolldir = 'down':this.scrolldir = 'up'
		if(diff < 0) diff = diff*-1;
		if(diff >= window.innerHeight){
			this.lazygo();
		}else{
			var self = this;
			this.timeouts.to=setTimeout(function(){
				self.lazygo();
			},300)
		}
	}
	//process the image list on scroll to show/hide visible elements
	lazygo(){
		if(this.G('state').Context === 'front') this.G('frontscroll',window.scrollY);
		this.oldy = window.scrollY;
		if(!this.ims) return;
		var self = this;
		var height = window.innerHeight;
		var st = window.scrollY-self.blocksize.top;
		var blocks = this.xMasonry.state.blocks;
		var active = [];
		var edge = [];
		Object.keys(blocks).forEach(function(key,index){
			var block = blocks[key]
			var top = block.top-st;
			var bottom = top+block.height;
			var image = self.ims[key];
			image.newstate = {}
			var vis = (bottom > (0-height) && top < (height*2))?true:false;
			var f = (bottom > (0) && top < (height+block.height))?true:false;
			image.vis = vis;
			if(image.state.vis!==vis){
				image.newstate.vis = vis;
			}
			if(f){
				active.push(image);
			}else if(vis){
				edge.push(image);
			}

		})
		this.range = tools.getrange(active.concat(edge),this.rangesize);
		edge.sort(function(a,b){
			return self.scrolldir==='down'?a.index-b.index:b.index-a.index
		});
		active = active.concat(edge);
		this.q=active.map(function(im){
			return im.props.image.index;
		});
		active = [];
		Object.keys(blocks).forEach(function(key,index){
			var image = self.ims[key];
			if((image.index < self.range.bottom || image.index > self.range.top) && !image.out){
				if(image.gone && !image.finished) self.batch++
				image.out = true;
				image.gone = false;
				image.finished = false;
				image.newstate.load = false;
				image.newstate.loaded = 'loading';
			}else if(image.index >= self.range.bottom && image.index <= self.range.top){
				if(!image.vis) active.push(image);
				image.out = false;
			}
			if(Object.keys(image.newstate).length){
				image.setState(image.newstate);
			}
			delete image.newstate;
		})
		active.sort(function(a,b){
			return self.scrolldir==='down'?a.index-b.index:b.index-a.index
		});
		active=active.map(function(im){
			return im.props.image.index;
		});
		this.q = this.q.concat(active);
		active = [];
		clearTimeout(self.timeouts.q)
		self.timeouts.q = setTimeout(function(){
			self.queue();
		},self.timeouts.qpace)
	}
	//handle the image rendering priority queue
	queue(){
		if(!this.batch||!this.ims) return;
		var self = this;
		this.q=this.q.filter(function(key){
			var image = self.ims[key];
			if(image && !image.finished && !image.gone && !image.out){
				return true;
			}
			return false;
		})
		if(!this.q.length) return;
		this.q.some(function(key,i){
			var stop = i > self.batch;
			if(!stop){
				self.ims[key].gone = true;
				self.batch--
				self.ims[key].setState({load:true});
			}
			return stop;
		})
	}
	//handler for browser window exiting before page is saved
	exit(){
		this.xblocks = null;
		this.ims = null;
		if(this.G('page').temp && !this.G('tempdeleted')){
			this.save();
			return true;
			//tools.sleep(1000);
		}
		return false;
	}

	//save a new page
	save(){
		var self = this;
		var page;
		var temp = (this.G('page').temp && !this.G('tempdeleted'));
		this.G('temp',temp);
		if(temp){
			page = this.G('page');
			delete page.temp;
			page.images = page.images.map(function(im){
				delete im.class;
				delete im.temp;
				im.front = im.front?true:false;
				return im;
			});
			crud.create(page.id,page).then(function(){
				self.G('temp',false);
				console.warn('saved new page');
				self.G('getPageList')();
				self.G('isloading')(true,'front');
			});
		}
		page = null;
		this.G('page',null);
		this.G('tempdeleted',false);
	}
	deleteSingle(event,index){
		if(event) event.stopPropagation();
		var ref = this.images[index].index*1;
		this.images.splice(index,1);
		var page = this.G('page')
		page.images = page.images.map(function(im){
			if(im.index*1 === ref){
				im.deleted = true;
				return im;
			}
			return im;
		})
		this.G('page',page);
		this.p.delete = crud.update('image','delete-single',page.id,{imageid:ref}).then(function(){},function(err){
			console.error(err);
		});
		var rem = page.images.filter(function(im){return !im.deleted}).length;
		if(!rem){

			this.G("noims")(page);
			return;
		}
		this.setState({
			trigger:this.state.trigger?false:true
		});
	}
	toFront(event,index){
		if(event) event.stopPropagation();
		var page = this.G('page');
		var ref = this.images[index].index*1;
		this.p.tofront = crud.update('image','to-front',page.id,{imageid:ref}).then(function(){},function(err){
			console.error(err);
		});
		var self = this;
		Object.keys(this.ims).forEach(function(key){
			if(ref === key*1){
				self.ims[key].setState({
					front:true
				})
			}else if(self.ims[key] && self.ims[key].state.front){
				self.ims[key].setState({
					front:false
				})
			}
		})
		page.images = page.images.map(function(im){
			if(im.index*1 === ref){
				im.front = true;
				return im;
			}
			im.front = false;
			return im;
		})
		this.G('page',page);
	}

	componentWillUnmount(){
		window.removeEventListener('scroll',this.imload);
		tools.cancel(this.p);
		var self = this;
		Object.keys(this.timeouts).forEach(function(key){
			clearTimeout(self.timeouts[key])
		})
		setTimeout(function(){
			self.save(true);
		})
	}

	componentWillReceiveProps(nextProps){
		if(this.G('state').loggedin !== this.state.loggedin) this.setState({
			loggedin:this.G('state').loggedin
		});
	}

	componentDidMount(){
		this.blocksize = document.getElementById('masonry').getBoundingClientRect();
		this.blocks()
	}

	shouldComponentUpdate(nextProps, nextState){

		var update = this.state.loggedin!==nextState.loggedin||this.G('page').images[0].index!==this.images[0].index || this.state.trigger !== nextState.trigger;
		//console.log('update:'+update);
		if(update && this.state.loggedin===nextState.loggedin && this.G('state').Context === 'page'){
			this.images = this.G('page').images.filter(function(im){
				return !im.deleted
			})
			this.images = tools.imageSort(this.images,'page');
			this.blocks();
		}else if(this.state.loggedin!==nextState.loggedin){
			this.lazygo();
		}
		return update;
	}

	render(){
		var style = window.getComputedStyle(document.getElementById("wall"), null);
		var w = (Math.floor(style.width.replace('px','')*1/40));
		var self = this;
		var images = this.images.map(function(image,index){
			//if(!self.xblocks[image.index] || index < self.range.bottom || index > self.range.top){
			if(!self.xblocks[image.index]){
				var w = tools.getClass(image);
				self.xblocks[image.index] = <XBlock key={image.index} width={w}><Image w={w} index = {index} image = {image} Global = {self.G} ref = {(x)=>{
					self.ims[image.index]=x
				}}/></XBlock>
				return self.xblocks[image.index];
			}
			self.ims[image.index].index = index;
			return self.xblocks[image.index]
		})
		return(
			<div  id = 'masonry' ref = {(outer)=>this.outer = outer}>
				{this.images && <XMasonry targetBlockWidth = {w} smartUpdate={false} updateOnFontLoad={false} updateOnImagesLoad={false}  ref={(x)=>this.xMasonry = x }>
					{images}
				</XMasonry>}
			</div>
		)
	}
}
