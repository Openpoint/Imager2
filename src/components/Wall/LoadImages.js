import React, { Component } from 'react';

export class LoadImages extends Component {
	constructor(props){
		super(props);
		this.G = this.props.Global;
		this.onload = this.onload.bind(this);
		this.onerror = this.onerror.bind(this);
		this.cancel = this.cancel.bind(this);
		this.G('cancel',this.cancel);
		this.ims={};
		this.dupes={};
		this.timeouts = {};
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
		if(!this.len){
			this.G('send')({message:'No new images were found at '+this.newpage.link})
		}else{
			this.state = {
				batch:5
			}
		}
	}
	onload(index,time){
		if(this.stop) return;
		console.log((time?'timedout:':'onload')+index);
		if(this.ims[index].done) return;
		this.ims[index].done = true;
		this.fin++
		this.G('send')({message:this.len-this.fin});
		clearTimeout(this.timeouts[index])
		var im = this.ims[index].image;
		var info={
			width:im.width,
			height:im.height,
			size:im.width*im.height,
			ratio:im.width/im.height,
			temp:true
		}

		if(!this.dupes[index] && info.size > 10000 && info.width > 150 && info.height > 100 && info.ratio < 3 && info.ratio > 0.33){
			this.ims[index].good = info;
		}
		this.dupes[index]=true;
		if(this.fin <= this.len){
			this.setState({
				batch:this.state.batch+1
			})
		}
	}
	onerror(index,time){
		if(this.stop) return;
		console.error(time?'timedoud':'error');
		if(this.ims[index].done) return;
		this.ims[index].done = true;
		this.fin++
		this.G('send')({message:this.len-this.fin});
		clearTimeout(this.timeouts[index])
		if(this.fin <= this.len){
			this.setState({
				batch:this.state.batch+1
			})
		}
	}
	cancel(){
		this.stop = true;
		this.done();
		this.G('send')(this.newpage);
	}
	done(){
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

	}
	componentDidUpdate(){
		if(this.complete) this.G('send')(this.newpage);
	}
	shouldComponentUpdate(nextProps,nextState){
		return(nextState.batch!==this.state.batch)
	}
	componentWillUnmount(){
		console.log('scraper will unmount')
		//delete this.ims;
		this.stop = true;
		var self = this;
		Object.keys(this.timeouts).forEach(function(key){
			clearTimeout(self.timeouts[key]);
		})
		delete this.newpage;
		delete this.dupes;
	}
	render(){
		var self = this;
		var images = this.newpage.images.map(function(im,i){
			if(i <= self.state.batch && (!self.ims[im.index]||!self.ims[im.index].done)) return (
				<img  key = {im.index.toString()} src = {im.src} alt = '' onLoad = {()=>self.onload(im.index)} onError = {()=>self.onerror(im.index)} ref = {function(image){
					if(!self.ims[im.index]){
						self.ims[im.index]={image:image,good:false,done:false,data:self.newpage.images[i]};
						self.timeouts[im.index] = setTimeout(function(){
							if(!image.height){
								self.onerror(im.index,true);
							}else{
								self.onload(im.index,true);
							}
						},2000)
					}
				}} />
			)
			return false;
		})
		images = images.filter(function(im){
			return im?true:false;
		})
		if(this.len-this.fin === 0) this.done();
		return(
			<div id = 'imagesloading'>
				{(this.len-this.fin > 0) && images}
			</div>
		)
	}
}
