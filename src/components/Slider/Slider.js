import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import tools from '../../modules/tools.js';
import crud from '../../modules/crud.js';
import './Slider.css';

export class Slider extends Component {
	constructor(props){
		super(props);
		this.G = this.props.Global;
		this.slideshow = this.slideshow.bind(this);
		this.G('slideshow',this.slideshow);
		this.slide = this.slide.bind(this);
		this.interval = 5000;
		this.random=[];
		this.seen = [];
		this.broken = {};
		this.p={};
		this.state = {
			slideshow:false,
			index:false,
			rindex:false,
			auto:false,
			random:false
		};
		var self = this;
		window.addEventListener('blur',function(){
			tools.nofullscreen();
			clearTimeout(self.auto);
			self.pause = true;
		})
		window.addEventListener('focus',function(){
			self.pause = false;
			if(self.state.auto) self.auto = setTimeout(function(){
				self.slide('r');
			},self.interval);
		})
	}

	slideshow(index){
		if(this.state.slideshow){
			clearTimeout(this.auto);
			if(this.p.random) this.p.random.cancel();
			this.setState({
				slideshow:false,
				index:false,
				//auto:false,
				random:false,
				front:false
			})
			tools.nofullscreen();
			this.old = false;
			return;
		}
		var self = this;
		if(index === 'front'){
			this.images = this.G('page').images.filter(function(im){
				return !im.deleted && !self.broken[im.index];
			});
			this.setState({
				slideshow:true,
				index:this.G('lastfront')||0,
				front:true,
				auto:true
			},function(){
				tools.fullscreen('slideshow')
			})
		}else{
			this.images = this.G('page').images.filter(function(im){
				return !im.deleted && !self.broken[im.index];
			});
			this.setState({
				slideshow:true,
				index:index
			},function(){
				tools.fullscreen('slideshow')
			})
		}
	}

	slide(dir,force,auto){
		this.dir = dir;
		var i,len,index;
		var self = this;
		if(this.state.random||force){
			len = this.random.length;
			if(typeof(this.state.rindex) === 'undefined'){
				index = -1;
			}else{
				index = this.state.rindex
			}
			dir === 'r'?i=index+1:i=index-1;
			if(i<0) i = len;
			if(i>len) i=0;
			if(this.random[i]){
				this.aniout();
				this.setState({
					rindex:i,
					auto:auto||this.state.auto
				})
			}else{
				var images = this.G('images');
				var random = Math.floor((Math.random() * images.length));
				var image = images[random];
				this.p.random = crud.post('show','image','random/'+image.id,image).then(function(im){

					if(!im || image.error){
						self.slide(dir)
						return;
					}
					self.random.push(im);
					self.aniout();
					self.setState({
						rindex:i,
						auto:auto||self.state.auto
					})
				},function(err){
					console.error(err);
				})
			}

			/*
			if(this.seen.length === this.G('pages').length) this.seen = [];
			var pages = this.G('pages').filter(function(i){
				return self.seen.indexOf(i) === -1;
			});
			var random = Math.floor((Math.random() * pages.length));
			this.seen.push(pages[random]);

			len = this.random.length;
			if(typeof(this.state.rindex) === 'undefined'){
				index = -1;
			}else{
				index = this.state.rindex
			}
			dir === 'r'?i=index+1:i=index-1;
			if(i<0) i = len;
			if(i>len) i=0;
			if(this.random[i]){
				this.aniout();
				this.setState({
					rindex:i,
					auto:auto||this.state.auto
				})
			}else{
				this.p.random = crud.read('show','image','random/'+pages[random]).then(function(image){
					if(!image || image.error){
						self.slide(dir)
						return;
					}
					image.parent = pages[random];
					self.random.push(image);
					self.aniout();
					self.setState({
						rindex:i,
						auto:auto||self.state.auto
					})
				},function(err){
					console.error(err);
				})
			}
			*/
			return;
		}
		this.aniout();
		len = this.images.length-1;
		(dir === 'r')?i=this.state.index+1:i=this.state.index-1;
		if(i<0) i = len;
		if(i>len) i=0;
		if(this.state.front) this.G('lastfront',i);
		if(this.broken[this.images[i].index]){
			console.log('broken');
		};
		this.setState({
			index:i,
			auto:auto||this.state.auto
		})
	}
	aniout(select){
		clearTimeout(this.anitime);
		if(select){
			select = "#slideshow ."+select+" img";
		}else{
			select = "#slideshow img";
		}
		document.querySelectorAll(select).forEach(function(i){
			i.className = 'noani';
		})
	}
	ani(select){
		clearTimeout(this.anitime);
		if(select){
			select = "#slideshow ."+select+" img";
		}else{
			select = "#slideshow img";
		}
		var elem = document.querySelectorAll(select);
		if(elem && elem.length) this.anitime = setTimeout(function(){
			elem.forEach(function(i){
				i.className = 'ani';
			})
		},10)
	}


	componentDidUpdate(prevProps, prevState){
		if(prevState.random!==this.state.random){
			clearTimeout(this.auto);
			if(this.p.random) this.p.random.cancel();
			if(this.state.random) this.slide('r',true);
		}
		if(prevState.auto!==this.state.auto){
			clearTimeout(this.auto);
			if(this.p.random) this.p.random.cancel();
			if(this.state.auto) this.slide('r');
		}
	}
	shouldComponentUpdate(nextProps,nextState){
		var update = (nextState.slideshow!==this.state.slideshow||(this.state.slideshow && (
			nextState.index!==this.state.index||
			nextState.rindex!==this.state.rindex||
			nextState.auto!==this.state.auto||
			nextState.random!==this.state.random
		)));
		return update;
	}
	render(){
		var image = false;
		var oldimage = false;
		clearTimeout(this.auto);
		if(this.image && !this.error && this.loaded) oldimage = this.image;
		this.error = false;
		this.loaded = false;
		var index = this.state.random?this.state.rindex:this.state.index;
		if(typeof index === 'number'){
			image = this.state.random?this.random[index]:this.images[index];
			var link;
			image.url?link=image.url:link=this.G('page').link||image.parenturl;
			this.image = image;
		}
		var busy = document.getElementById('ssbusy')
		if(busy) busy.setAttribute("active", true);;
		return(
			<div id='slideshow' className={this.state.slideshow?'open':'closed'}>

				<FontAwesome name='refresh' spin size='3x' id="ssbusy" />
				<div className='topcontrols'>
					<div>
						<FontAwesome name='arrows-alt' size='lg' onClick={()=>{tools.isfullscreen()?tools.nofullscreen():tools.fullscreen('slideshow')}} />
						{!this.state.auto && <FontAwesome  className='auto off' name='play-circle-o' size='lg' onClick={()=>this.setState({auto:true})} />}
						{this.state.auto && <FontAwesome className='auto on' name='pause-circle' size='lg' onClick={()=>this.setState({auto:false})} />}
						<FontAwesome name='random' size='lg' className={['random',this.state.random?'on':'off'].join(' ')} onClick={()=>{
							this.setState({
								random:this.state.random?false:true
							})
						}}/>
					</div>

					<div className = 'close'>
						{(this.state.random||this.state.front) && <FontAwesome name='picture-o' size='lg' onClick={()=>{
							this.G('history').push('/page/'+image.parent);
							this.slideshow(false);
						}} />}
						<FontAwesome name='google' size='lg' onClick={()=>tools.getDataUri(image.src)} />
						<FontAwesome name='times' size='2x' onClick={()=>{
							this.slideshow(false);
						}} />
					</div>

				</div>
				<FontAwesome name='chevron-left' size='2x' className='control left' onClick={()=>{
					//this.setState({auto:false});
					this.slide('l')
				}} />
				<FontAwesome name='chevron-right' size='2x' className='control right' onClick={()=>{
					//this.setState({auto:false});
					this.slide('r')
				}} />
				{this.state.slideshow && oldimage && (
					<div className='simage back'>
						<img className = 'ani' src={oldimage.src} alt='' width={oldimage.width} height={oldimage.height} />
					</div>
				)}
				{this.state.slideshow && image && (
					<div className='simage front'>
						<a href = {link} target = '_blank'>
							<img className = 'ani' src={image.src} alt='' width={image.width} height={image.height} ref = {(im)=>this.im = im}  onLoad = {()=>{
								document.getElementById('ssbusy').removeAttribute('active');
								this.ani();
								this.loaded = true;
								var self = this;
								if(this.state.auto && !this.pause) this.auto = setTimeout(function(){
									self.slide('r');
								},this.interval);
							}} onError = {()=>{
								this.broken[image.index]=true;
								this.error = true;
								var self = this;
								if(this.state.auto && !this.pause) this.auto = setTimeout(function(){
									self.slide('r');
								},500);
							}}/>
						</a>
					</div>
				)}

				{image.alt && <div className='alt'>{tools.decode(image.alt)}</div>}
			</div>
		)
	}
}
