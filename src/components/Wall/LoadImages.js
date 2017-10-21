import React, { Component } from 'react';

export class LoadImages extends Component {
	constructor(props){
		super(props);
		this.G = this.props.Global;

		this.clear = this.clear.bind(this);
		this.goodims = {};
		this.timeouts = {}
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
			this.ims = {};
			this.state = {
				index:false
			};
			var self = this;
			var dupe = {};
			this.newpage.images = this.newpage.images.filter(function(im){
				if(dupe[im.index]){
					self.len --;
					self.G('send')({message:self.len});
					return false;
				}
				dupe[im.index*1] = true;
				self.state[im.index*1] = {
					src:im.src,
					alt:im.alt,
					done:false,
					onload:function(){
						if(self.state[im.index*1].done) return;
						self.go(im.index*1);
					},
					onerror:function(){
						//console.error('Error: '+im.index*1)
						self.go(im.index*1,true);
					},
					timeout:function(){
						self.timeouts[im.index*1] = setTimeout(function(){
							//console.log('Error: '+im.index);
							self.go(im.index,true);
						},1000)
					}
				}
				return true;
			})
		}
	}
	go(index,error){
		index = index*1;
		clearTimeout(this.timeouts[index]);
		if(!error) this.goodims[index] = this.ims[index];
		this.len--;

		this.newstate = this.state;
		this.newstate[index]={
			src:'/blank.png',
			alt:'',
			done:true,
			onload:null,
			onerror:null,
			timeout:null
		}
		this.newstate.index = index;
		if(this.len){
			this.G('send')({message:this.len});
		}else{
			this.done();
		}
		this.setState(this.newstate);
	}
	done(){
		var self = this;
		this.newpage.temp=true;
		this.newpage.images = this.newpage.images.map(function(im){
			if(self.goodims[im.index*1]){
				im.width = self.goodims[im.index*1].width;
				im.height = self.goodims[im.index*1].height;
				im.size = im.width*im.height;
				im.ratio = im.width/im.height;
				im.temp = true;
				if(im.size > 10000 && im.width > 150 && im.height > 100 && im.ratio < 3 && im.ratio > 0.33){
					return im;
				}else{
					return null
				}
			}else{
				return null;
			}

		})
		this.newpage.images = this.newpage.images.filter(function(im){
			return im?true:false
		})
		this.G('send')(this.newpage);
	}
	clear(){
		var self = this;
		Object.keys(this.timeouts).forEach(function(key){
			clearTimeout(self.timeouts[key])
		})
	}
	componentDidMount(){
		//console.error('loadimages mounted')
		var self = this;
		Object.keys(this.ims).forEach(function(key){
			if(self.ims[key*1].complete && self.ims[key*1].naturalHeight !== 0 && !self.state[key*1].done){
				self.go(key);
			}else if(self.ims[key*1].complete && self.ims[key*1].naturalHeight === 0){
				//console.warn('Error: '+key);
				self.go(key,true);
			}
		});
	}

	componentDidUpdate(){
		var self = this;
		this.images.forEach(function(im){
			var key = im.key*1;
			if(self.ims[key].complete && self.ims[key].naturalHeight !== 0 && !self.state[key].done){
				self.go(key);
			}else if(self.ims[key].complete && self.ims[key].naturalHeight === 0){
				//console.warn('Error: '+key);
				self.go(key,true);
			}else{
				clearTimeout(self.timeouts[key])
				self.state[key].timeout();
			}
		})
	}
	componentWillUnmount(){
		//console.log('will unmount loadimages')
		this.clear();
	}

	render(){
		var self = this;
		if(!this.newpage.temp){
			this.images = this.newpage.images.filter(function(im){
				return !self.state[im.index*1].done;
			})
			this.images = this.images.slice(0,20);
			this.images = this.images.map(function(im){
				return <img key = {im.index.toString()} src = {self.state[im.index*1].src} alt = {self.state[im.index*1].alt} onLoad = {self.state[im.index*1].onload} onError = {self.state[im.index*1].onerror} ref = {(i)=>self.ims[im.index*1]=i} />
			})
		}else{
			this.images = [];
		}

		return(
			<div id = 'imagesloading'>
				{this.images}
			</div>
		)
	}
}
