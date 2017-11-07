import React, { Component } from 'react';
import tools from '../../modules/tools.js';

export class LoadImages extends Component {
	constructor(props){
		super(props);
		console.error('scraper mounted')
		this.G = this.props.Global;
		this.local = this.local.bind(this);
		this.next = this.next.bind(this);
		this.cancel = this.cancel.bind(this);
		this.G('cancel',this.cancel);
		this.ims={};
		this.fin = 0;

		this.newpage = this.G('loadimages');
		if(this.G('allims') && this.G('allims').length){
			var oldims = {}
			this.G('allims').forEach(function(im){
				oldims[im.index*1] = true;
			})
			this.newpage.images = this.newpage.images.filter(function(im){
				return !oldims[im.index*1];
			})
		}

		this.len = this.newpage.images.length;
		this.batch = 5;
		if(!this.len){
			console.error('abort')
			this.G('send')(this.newpage);
			this.newpage = null;
		}else{
			this.state = {
				batch:this.batch
			}
		}
	}
	local(key,val){
		if(!val) return this[key];
		this[key] = val;
	}
	next(index,info){
		this.ims[index].done = true;
		if(info && info.size > 10000 && info.width > 150 && info.height > 100 && info.ratio < 3 && info.ratio > 0.33){
			this.ims[index].good = info;
		}
		this.fin++
		this.G('send')({message:this.len-this.fin});
		this.batch++;
		if(this.fin < this.len){
			this.setState({
				batch:this.batch
			})
		}else{
			this.done();
		}
	}
	cancel(){
		this.stop = true;
		this.done();
	}
	done(){
		this.rendered = null;
		this.newpage.temp=true;
		var images = [];
		var self = this;
		Object.keys(this.ims).forEach(function(key){
			if(self.ims[key].good){
				Object.keys(self.ims[key].good).forEach(function(key2){
					self.ims[key].data[key2]=self.ims[key].good[key2];
				})
				images.push(self.ims[key].data);
			}
		})
		this.newpage.images = images;
		this.complete = true;
		this.G('send')(this.newpage);
	}
	shouldComponentUpdate(nextProps,nextState){
		if(!nextState) return false;
		return(nextState.batch!==this.state.batch)
	}
	componentWillUnmount(){
		console.error('scraper unmounted')
		this.stop = true;
	}
	render(){
		if(!this.newpage) return <div></div>;
		var self = this;
		var images = [];
		this.newpage.images.some(function(im,i){
			if(i > self.state.batch||self.stop||self.complete) return true;
			if(!self.ims[im.index]||!self.ims[im.index].done){
				if(!self.ims[im.index]) self.ims[im.index]={good:false,done:false,data:self.newpage.images[i]}
				images.push(
					<LoadIm key = {im.index.toString()} index = {im.index} src = {im.src} local = {self.local} />
				)
			}
			return false;
		})
		return(
			<div id = 'imagesloading'>
				{images}
			</div>
		)
	}
}
class LoadIm extends Component {
	constructor(props){
		super(props);
		this.l = this.props.local;
		this.onload = this.onload.bind(this);
		this.onerror = this.onerror.bind(this);
		this.checkload = this.checkload.bind(this);
		this.count = 0;
	}
	onload(){
		clearTimeout(this.timeout);
		if(this.l("stop")||this.done) return;
		this.done = true;
		var w = this.image.naturalWidth;
		var h = this.image.naturalHeight;
		var info={
			width:w,
			height:h,
			size:w*h,
			ratio:w/h,
			temp:true
		}
		this.l("next")(this.props.index,info);

	}
	onerror(){
		clearTimeout(this.timeout);
		if(this.l("stop")||this.done) return;
		this.done = true;
		this.l("next")(this.props.index);
	}
	checkload(){
		if(this.done) return;
		var filetype = tools.filetype(this.props.src);
		if(this.image && !this.image.naturalHeight && this.count > 20){
			this.onerror();
			return;
		}
		if(this.image && this.image.naturalHeight){
			if(filetype === 'gif'||!this.count) this.onload();
		}else{
			var self = this;
			this.timeout=setTimeout(function(){
				self.checkload();
			},100)
		}
		this.count++;
	}
	componentWillUnmount(){
		clearTimeout(this.timeout);
	}
	render(){
		var filetype = tools.filetype(this.props.src);
		var self = this;
		return(
			<div className = 'preview'>
				<img src = {this.props.src} alt = '' onLoad = {()=>self.onload()} onError = {()=>self.onerror()} className = {filetype} ref = {function(image){
					if(!self.image) self.image = image
					if(!self.timeout) self.checkload();
				}} />
			</div>
		)
	}
}
