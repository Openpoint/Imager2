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
		this.lazyload = this.lazyload.bind(this);
		this.lazygo = this.lazygo.bind(this);
		this.putim = this.putim.bind(this);
		this.G('putim',this.putim);
		this.ims = {};
		this.blocks = this.blocks.bind(this);
		this.save = this.save.bind(this);
		this.state = {
			loggedin:this.G('state').loggedin
		};
		this.p={};
		this.hackheight = 0;
		window.addEventListener('beforeunload',()=>this.save(true));
		window.addEventListener('scroll',this.lazyload);
	}
	putim(index,im){
		this.ims[index] = im;
	}
	blocks(){
		var self = this;
		if(!this.xMasonry){
			this.forceUpdate(function(){
				self.lazygo();
			});
			return;
		}

		var  l = Object.keys(self.xMasonry.state.blocks).length;
		if(!l||l!==this.images.length){
			this.bto = setTimeout(function(){
				self.blocks()
			})
		}else{
			self.lazygo();
		}
	}
	lazyload(){

		if(this.busy||this.to) return;
		this.busy=true;
		//clearTimeout(this.to);
		var self = this;
		this.to=setTimeout(function(){
			self.lazygo();
		},200)

	}
	lazygo(){

		this.busy = false;
		this.to=false;

		var self = this;
		var height = window.innerHeight;
		var st = window.scrollY-this.blocksize.top;
		var blocks = this.xMasonry.state.blocks;
		Object.keys(blocks).forEach(function(key){

			var block = blocks[key]
			var top = block.top-st;
			var bottom = top+block.height;
			var vis = (top >= 0-(block.height*2) && bottom <= height+(block.height*2))?true:false;
			if(self.ims[key].state.vis!==vis){
				var image = self.ims[key];
				if(vis && image.image.src.split('/').splice(-1)[0]==='blank.png'){
					var im = image.props.image;
					image.image.src = im.src;
					//console.log(image.image.naturalHeight,image.image.complete,image.image.src)
					if(image.image.naturalHeight && image.image.complete){
						image.setState({
							vis:true,
							loaded:'loaded'
						})
						return;
					}
					
					image.setState({
						vis:vis,
						loaded:'loading'
					})
					image.image.onerror = function(){
						if(image.image) image.setState({
							loaded:'error'
						})
					}
					image.image.onload = function(){
						if(image.image) image.setState({
							loaded:'loaded'
						})
					}

				}else{
					image.setState({vis:vis})
				}

			}
		})
	}
	save(close){
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
		var page = this.G('page');
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
		this.skip = true;
		this.forceUpdate();
	}
	toFront(event,index){
		if(event) event.stopPropagation();
		var page = this.G('page');
		var ref = this.images[index].index*1;
		this.p.tofront = crud.update('image','to-front',page.id,{imageid:ref}).then(function(){},function(err){
			console.error(err);
		});
		page.images = page.images.map(function(im){
			if(im.index*1 === ref){
				im.front = true;
				return im;
			}else{
				im.front = false;
				return im;
			}
		})
		this.images[index].front = true;
		this.G('page',page);
		this.forceUpdate();
	}

	componentWillUnmount(){
		console.log("imagelist will unmount")
		tools.cancel(this.p);
		clearTimeout(this.bto);
		this.save();
		window.removeEventListener('scroll',this.lazyload);
	}

	componentWillReceiveProps(nextProps){
		if(this.G('state').loggedin !== this.state.loggedin) this.setState({
			loggedin:this.G('state').loggedin
		});
	}
	componentDidUpdate(){
		this.blocks()
	}
	componentDidMount(){
		console.warn('imagelist mounted')
		this.images = this.G('page').images.filter(function(im){
			return !im.deleted
		})
		this.blocksize = document.getElementById('masonry').getBoundingClientRect();
		this.blocks();
	}

	shouldComponentUpdate(nextProps, nextState){
		var update = this.state.loggedin!==nextState.loggedin||this.G('page').images[0].index!==this.images[0].index;
		console.log('update:'+update);
		if(update && this.state.loggedin===nextState.loggedin && this.G('state').Context === 'page'){
			this.images = this.G('page').images.filter(function(im){
				return !im.deleted
			})
			this.images = tools.imageSort(this.images,'page');
		}
		return update;
	}

	render(){
		//console.error('render the imagelist')
		var style = window.getComputedStyle(document.getElementById("wall"), null);
		var w = (Math.floor(style.width.replace('px','')*1/40));
		var self = this;

		if(this.images) var images = this.images.map(function(image,index){
			var w = tools.getClass(image);
			return <XBlock key={image.index} width={w}><Image image = {image} index = {index} Global = {self.G} putim = {self.putim} /></XBlock>
		})
		this.skip = false;
		return(
			<div  id = 'masonry'>
				{this.images && <XMasonry targetBlockWidth = {w} smartUpdate={false} updateOnFontLoad={false} updateOnImagesLoad={false}  ref={(x)=>this.xMasonry = x }>
					{images}
				</XMasonry>}
			</div>
		)
	}
}
