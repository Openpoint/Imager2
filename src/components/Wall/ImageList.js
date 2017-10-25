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
		//this.load= this.load.bind(this);
		this.G('putim',this.putim);

		this.blocks = this.blocks.bind(this);
		this.save = this.save.bind(this);
		this.exit = this.exit.bind(this);
		this.state = {
			loggedin:this.G('state').loggedin,
			trigger:false
		};
		this.p={};
		this.timeouts = {};
		this.ims = {};
		this.xblocks = {};
		this.q = [];
		this.q2 = {};
		this.batch = 5;
		this.ready = false;
		window.addEventListener('beforeunload',this.exit);
		window.addEventListener('scroll',this.imload);

		this.images = this.G('page').images.filter(function(im){
			return !im.deleted
		})

		var self = this;
		this.G('imonload',function(image){
			//console.warn(trigger,image.props.image.index)
			clearTimeout(self.timeouts[image.props.image.index])
			if(self.q2[image.props.image.index].finished) return;
			self.q2[image.props.image.index].finished = true;
			self.batch++;
			tools.canvas(image);
			clearTimeout(self.timeouts.q)
			self.timeouts.q = setTimeout(function(){
				self.queue();
			},1000)

			image.setState({
				loaded:'loaded'
			});
		})
		this.G('imonerror',function(image){
			//console.error('error');
			clearTimeout(self.timeouts[image.props.image.index])
			if(self.q2[image.props.image.index].finished) return;
			self.q2[image.props.image.index].finished = true;

			self.batch++;
			clearTimeout(self.timeouts.q)
			self.timeouts.q = setTimeout(function(){
				self.queue();
			},1000)
			image.setState({
				loaded:'error',
				load:false
			});
		})
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
			this.q = Object.keys(this.ims).filter(function(key){
				if(!self.q2[key]) self.q2[key]={};
				return self.ims[key]?true:false
			})
			this.q = this.q.sort(function(a,b){
				return self.ims[a].props.index - self.ims[b].props.index
			});
			console.error(Object.keys(self.ims).length)
			this.ready = true;
			this.lazygo();
		}
	}
	//The timed scroll trigger handler for window onscroll
	imload(){
		if(this.busy||this.to) return;
		if(this.G('state').Context === 'front') this.G('frontscroll',window.scrollY)
		this.busy=true;
		var self = this;
		//clearTimeout(this.timeouts.to);
		this.timeouts.to=setTimeout(function(){
			self.busy = false;
			self.timeouts.to=false;
			self.lazygo();
		},200)
	}
	//process the image list on scroll to show/hide visible elements
	lazygo(){
		var self = this;
		var height = window.innerHeight;
		var st = window.scrollY-this.blocksize.top;
		var blocks = this.xMasonry.state.blocks;
		Object.keys(blocks).forEach(function(key){
			var block = blocks[key]
			var top = block.top-st;
			var bottom = top+block.height;
			var image = self.ims[key];
			var vis = (top >= 0-(block.height*2) && bottom <= height+(block.height*2))?true:false;
			image.vis = vis;
			if(vis && !image.state.vis && !self.q2[key].seen && !self.q2[key].gone){
				self.q2[key].seen = true;
				clearTimeout(self.timeouts.q)
				self.queue(key);
			}
			if(image.state.vis!==vis){
				image.setState({vis:vis})
			}
		})
	}
	//handle the image rendering priority queue
	queue(k){
		var self = this;
		if(k){
			this.q.unshift(k)
		};
		this.q=this.q.filter(function(key){
			//console.log(self.ims[key].state.load,self.ims[key].state.loaded)
			if(!self.q2[key].finished && !self.q2[key].gone){
				return true;
			}
			return false;
		})
		if(!this.ready) return;
		var size = 0;
		console.log(this.batch)
		this.q.some(function(key,i){
			var stop = !(i < (self.batch) && i < 5);
			if(!stop){
				size++
				self.q2[key].gone = true;
				self.batch--
				/*
				self.timeouts[key] = setTimeout(function(){
					self.G('imonerror')(self.ims[key])
				},3000)
				*/
				self.ims[key].setState({load:true},function(){
					if(self.ims[key].image && self.ims[key].image.complete) self.G('imonload')(self.ims[key]);
				});
			}
			return stop;
		})
	}
	//handler for browser window exiting before page is saved
	exit(){
		this.save(true);
	}

	//save a new page
	save(close){
		window.removeEventListener('beforeunload',this.exit);
		if(this.G('page').temp && !this.G('tempdeleted')){
			var page = this.G('page');
			delete page.temp;
			page.images = page.images.map(function(im){
				delete im.class;
				delete im.temp;
				im.front = im.front?true:false;
				return im;
			});
			var self = this;
			crud.create(page.id,page).then(function(){
				console.warn('saved new page');
				self.G('getPageList')();
				self.G('isloading')(true,'front');
			});
			if(close) tools.sleep(100)
		}
		this.G('page',false);
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
	}

	componentWillUnmount(){
		window.removeEventListener('scroll',this.imload);
		console.log("imagelist will unmount")
		tools.cancel(this.p);
		var self = this;
		Object.keys(this.timeouts).forEach(function(key){
			clearTimeout(self.timeouts[key])
		})
		this.save();
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
		}else if(this.state.loggedin!==nextState.loggedin){
			this.lazygo();
		}
		return update;
	}

	render(){
		//console.error('render the imagelist')
		var style = window.getComputedStyle(document.getElementById("wall"), null);
		var w = (Math.floor(style.width.replace('px','')*1/40));
		var self = this;
		var images = this.images.map(function(image,index){
			if(!self.xblocks[image.index]){
				var w = tools.getClass(image);
				self.xblocks[image.index] = <XBlock key={image.index} width={w}><Image w={w} index = {index} image = {image} Global = {self.G} ref = {(x)=>{self.ims[image.index]=x}}/></XBlock>
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
