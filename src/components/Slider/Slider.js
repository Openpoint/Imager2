import React, {Component} from 'react';
import {Tooltip} from '../Tooltip/Tooltip.js';
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
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.blur = this.blur.bind(this);
		this.focus = this.focus.bind(this);
		this.interval = 8000;
		this.random=[];
		this.seen = [];
		this.broken = {};
		this.p={};
		this.to={};
		this.state = {
			slideshow:false,
			index:false,
			rindex:false,
			auto:false,
			random:false
		};
		window.addEventListener('blur',this.blur)
		window.addEventListener('focus',this.focus)

	}
	blur(){
		tools.nofullscreen();
		if(this.state.auto){
			this.pause = true;
			this.setState({auto:false})
		}
	}
	focus(){
		if(this.pause){
			this.setState({auto:true},()=>{
				this.pause = false;
				var self = this;
				this.to.auto = setTimeout(function(){
					if(self.state.slideshow && self.state.auto && !self.pause) self.slide('r');
				},3000);
			});
		}
	}
	slideshow(index){
		if(this.state.slideshow){
			clearTimeout(this.to.auto);
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
		this.images = this.G('page').images;
		if(index === 'front'){
			this.setState({
				slideshow:true,
				index:this.G('lastfront')||0,
				front:true,
				auto:true
			},function(){
				tools.fullscreen('slideshow')
			})
		}else{
			this.images = tools.imageSort(this.images,'page');
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
	show(){
		clearTimeout(this.to.hide);
		this.container.setAttribute('data-hidden',false);
		this.hide();
	}
	hide(){
		clearTimeout(this.to.hide);
		if(this.nohide) return;
		var self = this;
		this.to.hide = setTimeout(function(){
			self.container.setAttribute('data-hidden',true);
		},2000)
	}
	componentWillUpdate(nextProps, nextState){
		if(!nextState.slideshow){
			tools.cancel(this.p,'p')
			tools.cancel(this.to,'to')
		}else{
			this.hide();
		}
	}
	componentDidUpdate(prevProps, prevState){
		console.log(this.state.auto);
		if(prevState.index!==this.state.index||prevState.rindex!==this.state.rindex||prevState.random!==this.state.random){
			this.ani('back');
			if(prevState.random===this.state.random) return;
		}
		tools.cancel(this.p,'p');
		tools.cancel(this.to,'to');
		if(!this.pause) this.slide('r',this.state.random);
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
	componentDidMount(){
		this.container = document.getElementById('slideshow');
		this.alt = document.getElementById('alt');
	}
	componentWillUnmount(){
		window.removeEventListener('blur',this.blur)
		window.removeEventListener('focus',this.focus)
		tools.cancel(this.p,'p')
		tools.cancel(this.to,'to')
	}
	render(){
		var image = false;
		var oldimage = false;
		clearTimeout(this.to.auto);
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
		if(busy) busy.setAttribute("active", true);
		if(!this.state.random && this.state.slideshow){
			var top = document.querySelector('#wall .page,#wall .front');
			if(top){
				top = top.offsetTop;
				top = document.querySelector("[data-key='"+image.index+"']").offsetTop+top;
				window.scrollTo(0,top);
			}
		}
		return(
			<div id='slideshow' className={this.state.slideshow?'open':'closed'} data-hidden = {false} onMouseMove = {()=>{this.show()}}>
				<FontAwesome name='refresh' spin size='3x' id="ssbusy" />
				<div className='topcontrols'>
					<div>
						<div className = 'ttParent control'>
							<FontAwesome name='arrows-alt' size='lg' onClick={()=>{tools.isfullscreen()?tools.nofullscreen():tools.fullscreen('slideshow')}} onMouseEnter = {()=>this.nohide = true}  onMouseLeave = {()=>this.nohide = false} />
							<Tooltip message = "Toggle fullscreen" position='bottom right' />
						</div>
						{!this.state.auto && <div className = 'ttParent control'>
							<FontAwesome  className='auto off' name='play-circle-o' size='lg' onClick={()=>this.setState({auto:true})} onMouseEnter = {()=>this.nohide = true}  onMouseLeave = {()=>this.nohide = false} />
							<Tooltip message = "Turn autoplay on" position='bottom' />
						</div>}
						{this.state.auto && <div className = 'ttParent control'>
							<FontAwesome className='auto on' name='pause-circle' size='lg' onClick={()=>this.setState({auto:false})} onMouseEnter = {()=>this.nohide = true}  onMouseLeave = {()=>this.nohide = false} />
							<Tooltip message = "Turn autoplay off" position='bottom' />
						</div>}
						<div className = 'ttParent control'>
							<FontAwesome name='random' size='lg' className={['random',this.state.random?'on':'off'].join(' ')} onMouseEnter = {()=>this.nohide = true}  onMouseLeave = {()=>this.nohide = false} onClick={()=>{
								this.setState({
									random:this.state.random?false:true
								})
							}}/>
							<Tooltip message = "Toggle between active page or random images" position='bottom' width = "200"/>
						</div>
					</div>

					<div className = 'close'>
						<div className = 'ttParent control'>
							{(this.state.random||this.state.front) && <FontAwesome name='picture-o' size='lg' onMouseEnter = {()=>this.nohide = true}  onMouseLeave = {()=>this.nohide = false} onClick={()=>{
								this.G('history').push('/page/'+image.parent+'?im='+image.index);
								this.slideshow(false);
							}} />}
							<Tooltip message = "Go to Imager page for this image" position='bottom' />
						</div>
						<div className = 'ttParent control'>
							<FontAwesome name='google' size='lg' onMouseEnter = {()=>this.nohide = true}  onMouseLeave = {()=>this.nohide = false} onClick={()=>tools.getDataUri(image.src)} />
							<Tooltip message = "Reverse image lookup" position='bottom left' />
						</div>
						<div className = 'control'>
							<FontAwesome name='times' size='2x' onMouseEnter = {()=>this.nohide = true}  onMouseLeave = {()=>this.nohide = false} onClick={()=>{
								this.slideshow(false);
							}} />
						</div>
					</div>

				</div>
				<FontAwesome name='chevron-left' size='2x' className='control left' onMouseEnter = {()=>this.nohide = true}  onMouseLeave = {()=>this.nohide = false} onClick={()=>{
					//this.setState({auto:false});
					this.slide('l')
				}} />
				<FontAwesome name='chevron-right' size='2x' className='control right' onMouseEnter = {()=>this.nohide = true}  onMouseLeave = {()=>this.nohide = false} onClick={()=>{
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
						<span style={{cursor:'pointer'}} onClick = {()=>{
							var win = window.open(link, '_blank');
  							win.focus();
						}}>
							<img className = 'ani' src={image.src} alt='' width={image.width} height={image.height} ref = {(im)=>this.im = im}  onLoad = {()=>{
								document.getElementById('ssbusy').removeAttribute('active');
								this.ani();
								this.loaded = true;
								var self = this;
								if(this.state.auto && !this.pause) this.to.auto = setTimeout(function(){
									if(self.state.slideshow && self.state.auto && !self.pause) self.slide('r');
								},this.interval);
							}} onError = {()=>{
								this.broken[image.index]=true;
								this.error = true;
								var self = this;
								if(this.state.auto && !this.pause) this.to.auto = setTimeout(function(){
									if(self.state.slideshow && self.state.auto && !self.pause) self.slide('r');
								},500);
							}}/>
						</span>
					</div>
				)}

				<div id='alt' className='alt' data-hidden = {this.G("hidealt")}>
					{image.alt && <div>{tools.decode(image.alt)}</div>}
					<div className = 'ttParent control altshow'>
						<FontAwesome name='ban' onClick = {()=>{
							var hidealt = this.G("hidealt")
							hidealt?hidealt=false:hidealt=true;
							this.alt.setAttribute('data-hidden',hidealt);
							this.G("hidealt",hidealt);
						}}/>
						<Tooltip message = "Toggle autohide on image info" position='top right' width = '200'/>
					</div>
				</div>
			</div>
		)
	}
}
