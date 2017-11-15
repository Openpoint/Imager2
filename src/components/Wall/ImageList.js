import React, { Component } from 'react';
import {XMasonry,XBlock} from "react-xmasonry/dist/index.js"
import {Image} from './Image.js';
import crud from '../../modules/crud.js';
import tools from '../../modules/tools.js';

export class ImageList extends Component {

	constructor(props){
		super(props);
		this.G = this.props.Global;
		this.deleteSingle = this.deleteSingle.bind(this);
		this.G('deleteSingle',this.deleteSingle);
		this.toFront = this.toFront.bind(this);
		this.G('toFront',this.toFront);
		this.imload = this.imload.bind(this);
		this.lazygo = this.lazygo.bind(this);
		this.queue = this.queue.bind(this);
		this.blocks = this.blocks.bind(this);
		this.save = this.save.bind(this);
		this.exit = this.exit.bind(this);
		this.next = this.next.bind(this);
		this.G('exit',this.exit);
		this.state = {
			loggedin:this.G('state').loggedin,
			trigger:false
		};
		this.p={};
		this.qpace = 100;
		this.timeouts = {};
		this.ims = {};
		this.q = [];
		this.oldy = 0;
		this.batch = 10;
		this.scrolldir = 'down';
		this.rangesize = 200;
		this.range={
			bottom:0,
			top:this.rangesize
		}
		window.addEventListener('scroll',this.imload);
	}
	//check for when masonary has finished the layout and knows all the elements sizes and positions,all images are ready to be loaded
	blocks(){
		console.log("start blocks");
		var  l = Object.keys(this.xMasonry.state.blocks).length;
		this.l2 = Object.keys(this.ims).length;
		if(!this.l2||!l||this.l2!==l){
			var self = this;
			this.timeouts.bto = setTimeout(function(){
				self.blocks()
			},100)
		}else{
			this.top = document.querySelector('#wall .page,#wall .front').offsetTop;

			var focus = tools.getURLParameter('im');
			if(focus){
				var top = document.querySelector("[data-key='"+focus+"']").offsetTop+this.top;
				window.scrollTo(0,top);
			}
			console.log('blocks done');
			this.lazygo();
		}
	}
	//process image loaded or errored
	next(){
		this.batch++;
		clearTimeout(this.timeouts.q);
		var self = this;
		this.timeouts.q = setTimeout(function(){
			self.queue();
		},this.qpace)
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
		//if(!this.ims) return;
		var self = this;
		var height = window.innerHeight;
		var st = Math.round(window.scrollY-this.top);
		var active = [];
		var edge = [];
		var blocks = this.xMasonry.state.blocks;
		var blist = Object.keys(blocks);
		if(!blist.length) return;
		blist.forEach(function(key,index){
			var block = blocks[key]
			var top = Math.round(block.top-st);
			var bottom = top+block.height;

			var image = self.ims[key];
			image.newstate = {}
			var vis = (bottom > (0-height) && top < (height*2))?true:false;
			var f = (bottom > (0) && top < (height+block.height))?true:false;
			if(image.vis!==vis){
				image.vis = vis;
				var id = image.props.image.index;
				document.getElementById(id).setAttribute('data-vis',vis)
			}

			if(f){
				active.push({index:image.ix,id:image.props.image.index});
			}else if(vis){
				edge.push({index:image.ix,id:image.props.image.index});
			}
		})
		this.range = tools.getrange(active.concat(edge),this.rangesize);
		edge.sort(function(a,b){
			return self.scrolldir==='down'?a.ix-b.ix:b.ix-a.ix
		});
		active = active.concat(edge);
		this.q=active.map(function(im){
			return im.id;
		});
		active = [];
		clearTimeout(self.timeouts.q)
		this.timeouts.q = setTimeout(function(){
			self.queue(true);
		},this.qpace)
	}
	//handle the image rendering priority queue
	queue(priority){
		if(!this.batch) return;

		var self = this;
		if(priority) this.qrange={b:this.l2,t:0};
		this.q=this.q.filter(function(key){
			var image = self.ims[key];
			if(priority){
				if(image.ix < self.qrange.b) self.qrange.b = image.ix;
				if(image.ix > self.qrange.t) self.qrange.t = image.ix;
			}
			if(!image.finished && !image.gone){
				return true;
			}
			return false;
		})
		var preload = {
			up:[],
			down:[]
		}
		if(!this.q.length){
			Object.keys(this.ims).forEach(function(key){
				var i = self.ims[key].ix;
				if(self.ims[key].gone && (i < self.range.bottom || i > self.range.top)){
					self.ims[key].gone=false;
					self.ims[key].finished=false;
					self.ims[key].setState({
						load:false,
						loaded:self.ims[key].state.loaded==='error'?'error':'loading'
					})
					return;
				}
				if(self.ims[key].gone) return;
				if(i > self.qrange.t && i <= self.range.top) preload.down.push(self.ims[key].props.image.index);
				if(i < self.qrange.b && i >= self.range.bottom) preload.up.push(self.ims[key].props.image.index);
			})
			if(preload[this.scrolldir].length){
				this.q = preload[this.scrolldir];
			}else{
				var dir = this.scrolldir==='down'?'up':'down';
				this.q = preload[dir];
			}
			if(this.q.length){
				clearTimeout(this.timeouts.q);
				this.timeouts.q = setTimeout(function(){
					self.queue();
				},this.qpace)
			}
			return;
		}
		var out = 0;
		var batch = this.batch;
		this.q.some(function(key,i){
			var stop = i >= batch;
			self.ims[key].gone = true;
			self.ims[key].setState({load:true});
			out++;
			return stop;
		})
		this.batch = this.batch -out;
	}
	//handler for browser window exiting before page is saved
	exit(){
		window.removeEventListener('scroll',this.imload);
		tools.cancel(this.p,'p');
		tools.cancel(this.timeouts,'to');
		var self = this;
		Object.keys(this.ims).forEach(function(key){
			self.ims[key].I = null;
			self.ims[key].CTX = null;
			self.ims[key].canvas = null;
		})
		this.ims = null;
		this.xMasonry = null;
		this.q = null;

		if(this.G('page').temp && !this.G('tempdeleted')){
			this.save(true);
		}
		this.setState({exit:true})
	}

	//save a new page
	save(async){
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
			crud.create(page.id,page,async).then(function(res){
				if(!async){
					self.G('temp',false);
					console.warn('saved new page');
					self.G('getPageList')();
					self.G('isloading')(true,'front');
				}
			});

		}
		this.G('tempdeleted',false);
	}
	deleteSingle(index){
		var ref = this.images[index].index*1;
		delete this.ims[ref];
		//this.images.splice(index,1);
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
		this.setState({
			trigger:this.state.trigger?false:true
		});
	}
	toFront(index){
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
		tools.cancel(this.p,'p');
		tools.cancel(this.timeouts,'to');
		this.ims = null;
		this.xMasonry = null;
		this.q = null;
		this.save();
		this.G('page',null);
	}
	componentWillReceiveProps(nextProps){
		if(this.G('state').loggedin !== this.state.loggedin) this.setState({
			loggedin:this.G('state').loggedin
		});
	}

	shouldComponentUpdate(nextProps, nextState){
		//if(!this.G('page')||!this.G('page').images||!this.G('page').images.length) return false;
		var update = this.state.loggedin!==nextState.loggedin||this.G('page').images[0].index!==this.images[0].index || this.state.trigger !== nextState.trigger;
		if(this.state.loggedin!==nextState.loggedin){
			this.lazygo();
		}
		return update;
	}
	componentDidUpdate(){
		if(!this.images.length) this.G("noims")();
	}
	render(){
		if(this.state.exit) return null;
		var style = window.getComputedStyle(document.getElementById("wall"), null);
		var w = (Math.floor(style.width.replace('px','')*1/40));
		var self = this;
		console.error('render imagewall')
		this.images = tools.imageSort(this.G('page').images,this.G('state').Context);
		var images = this.images.map(function(image,index){
			var w = tools.getClass(image);
			return <XBlock key={image.index} width={w}>
				<div id={image.index} data-vis="false" className='image' >
					<div className='iback group'>
						<div className='spacer' style={{height:0,marginTop:100/image.ratio+'%'}}></div>
					</div>
					<Image w={w} index = {index} image = {image} Global = {self.G} next = {self.next} ref = {(x)=>{
						if(x && !self.ims[image.index]){
							self.ims[image.index]=x;
						}
					}} />
				</div>
			</XBlock>
		})
		if(!images.length){
			return null;
		}
		return(
			<div  id = 'masonry'>
				{images.length && <XMasonry targetBlockWidth = {w} smartUpdate={false} updateOnFontLoad={false} updateOnImagesLoad={false}  ref={(x)=>{
					if(x){
						this.xMasonry = x;
						this.blocks();
					}
				}}>{images}</XMasonry>}
			</div>
		)
	}
}
