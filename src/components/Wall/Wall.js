import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {XMasonry,XBlock} from "react-xmasonry/dist/index.js"
import FontAwesome from 'react-fontawesome';
import {Tooltip} from '../Tooltip/Tooltip.js';
import {Slider} from '../Slider/Slider.js';
import SCRAPE from '../../modules/scrape.js';
import crud from '../../modules/crud.js';
import tools from '../../modules/tools.js';
import './Wall.css';
const scraper = new SCRAPE(process.env.PUBLIC_URL,process.env.API_PORT);

class Image extends Component {
	constructor(props){
		super(props);
		this.reverse = this.reverse.bind(this);
		this.state = {loaded:false};
	}

	reverse(event,url){
		if(event) event.stopPropagation();
		tools.getDataUri(url)
	}
	componentDidMount(){
		if(this.image) this.image.onload = ()=>{
			if(this.canvas){
				var h = this.ifront.clientHeight;
				var w = this.ifront.clientWidth;
				this.canvas.width = w;
				this.canvas.height=h;
				var ctx = this.canvas.getContext('2d');
				ctx.drawImage(this.image,0,0,w,h);
			}
			if(this.image) this.setState({loaded:true})
		};
		if(this.favicon){
			this.favicon.style.opacity = 0;
			this.favicon.onload = ()=>{
				this.favicon.style.opacity = 1;
			}
			/*
			this.favicon.onerror = ()=>{
				if(this.favicon) this.favicon.style.display = 'none';
			}
			*/
		}
	}
	render(){
		var image = this.props.image;
		var functions = this.props.functions;
		var states = this.props.states;

		if(!this.image){
			this.image = document.createElement('img');
			this.image.src = image.src;
		}
		//<img src={image.src} alt = {image.alt} ref = {(image)=>this.image=image}/>
		if(states.App.context === 'front'){
			return(
				<Link to={"/page/"+image.parent} className={[this.state.loaded?'loaded':'loading','image','ttParent'].join(' ')} >
					{image.favicon && <div className='favicon ttParent'>
						<img src={image.favicon} alt = 'favicon' ref={(favicon)=>this.favicon=favicon}/>
						<Tooltip message = {tools.sitename(image.parenturl)} position = 'top' />
					</div>}
					<div className='iback group'>
						<div className='spacer' style={{height:0,marginTop:100/image.ratio+'%'}}></div>
					</div>
					<div className='ifront' ref={(ifront)=>this.ifront = ifront}>
						{tools.filetype(image.src)!=='gif' && <canvas ref={(canvas)=>this.canvas = canvas}></canvas>}
						{tools.filetype(image.src)==='gif' && <img src = {image.src} alt = {image.alt} />}
					</div>
					<Tooltip message = {tools.decode(image.info).substring(0,200)+'...'} position = 'bottom' />
				</Link>
			)
		}else{
			return(
				<div className={[this.state.loaded?'loaded':'loading','image','ttParent',image.class].join(' ')} onClick = {()=>{functions.Wall.slideshow(this.props.index)}}>

					<div className='iback group'>
						<div className='spacer' style={{height:0,marginTop:100/image.ratio+'%'}}></div>
					</div>

					<div className='ifront' ref={(ifront)=>this.ifront = ifront}>
						{tools.filetype(image.src)!=='gif' && <canvas ref={(canvas)=>this.canvas = canvas}></canvas>}
						{tools.filetype(image.src)==='gif' && <img src = {image.src} alt = {image.alt} />}
					</div>
					<div className  = 'controls'>
						{image.src.indexOf('data:')!==0 && <div className='control ttParent' onClick={(event)=>{this.reverse(event,image.src)}} >
							<FontAwesome name='google' />
							<Tooltip message = 'Reverse image lookup' position='top' />
						</div>}

						{!image.front && !image.deleted && states.App.loggedin && (
							<div className='control ttParent' onClick={(event)=>{functions.ImageList.toFront(event,this.props.index)}}  >
								<FontAwesome name='paperclip' />
								<Tooltip message = 'Set as Front Image'  position='top' />
							</div>
						)}
						<div className='control ttParent' onClick={(event)=>{functions.ImageList.delete(event,this.props.index)}} >
							<a href={image.src} download target='_blank'><FontAwesome name='download' /></a>
							<Tooltip message = 'Download Image' position='top' />
						</div>
						{states.App.loggedin && (
							<div className='control ttParent' onClick={(event)=>{functions.ImageList.delete(event,this.props.index,this)}} >
								<FontAwesome name={image.deleted?'check':'times'} />
								<Tooltip message = {image.deleted?'Restore Image':'Delete Image'} position='top' />
							</div>
						)}
					</div>
					{image.alt && <Tooltip message = {tools.decode(image.alt)} position = 'bottom' />}
				</div>
			)
		}
	}
}


var max =40;

export class ImageList extends Component {
	constructor(props){
		super(props);
		this.delete = this.delete.bind(this);
		this.toFront = this.toFront.bind(this);
		this.lazyload = this.lazyload.bind(this);
		this.getImages = this.getImages.bind(this);
		this.max = max;
		window.addEventListener('scroll',this.lazyload);
		this.functions = this.props.functions;
		this.states = this.props.states;
		this.functions.ImageList = tools.getFunctions(this);
		this.state = {images:[],max:max};
	}

	delete(event,index){
		if(event) event.stopPropagation();
		var images = this.props.states.Wall.images;
		var id = this.props.states.Wall.id;
		var self = this;
		crud.update('image','delete-single',id,{imageid:images[index].index}).then(function(data){
			if(data.auth){
				images.splice(index,1);
				//self.props.functions.Wall.refreshImages(images);
				self.getImages(images,true)
			}
		},function(err){
			console.error(err);
		});
	}
	toFront(event,index){
		if(event) event.stopPropagation();
		var images = this.props.states.Wall.images;
		var id = this.props.states.Wall.id;
		var self = this;
		crud.update('image','to-front',id,{imageid:images[index].index}).then(function(data){
			if(data.auth){
				images = images.map(function(im){
					im.front = false;
					return im;
				})
				images[index].front = true;
				//self.props.functions.Wall.refreshImages(images);
				self.getImages(images,true)
			}
		},function(err){
			console.error(err);
		});
	}
	lazyload(){

		var alldone = (this.max >= this.states.Wall.images.length);
		console.error(alldone)
		if(alldone || this.lazytime || this.busy) return;
		var self = this;
		this.lazytime=setTimeout(function(){
			var height = window.innerHeight;
			var top = self.lazy.getBoundingClientRect().top-(height/2);
			var visible = (top < height);
			if(visible){
				self.getImages(self.states.Wall.images);
			}
			self.lazytime = false;
		},500);
	}
	getImages(images,added){
		this.busy = true;
		var self = this;
		var spinner;
		this.max = this.state.max;
		(this.state.max < images.length)?spinner=true:spinner=false;
		console.error('spinner: '+spinner)
		if(added){
			images = images.slice(0,this.state.max);
			images = images.map(function(image,index){
				var w = tools.getClass(image);
				return <XBlock key={image.index} width={w}><Image image = {image} index = {index} functions = {self.functions} states = {self.states} /></XBlock>
			})
		}else{
			var l = this.state.images.length;
			images = images.slice(l,this.state.max);
			images = images.map(function(image,index){
				var w = tools.getClass(image);
				return <XBlock key={image.index} width={w}><Image image = {image} index = {l+index} functions = {self.functions} states = {self.states} /></XBlock>
			})
			images = this.state.images.concat(images);
		}

		var m;
		(added || !spinner)?m = this.state.max:m = this.state.max+max;

		this.setState({
			images:images,
			max:m,
			spinner:spinner
		},function(){
			self.busy = false;
		})
	}
	componentDidMount() {
		this.getImages(this.props.states.Wall.images);
   }
	componentWillUnmount(){
		window.removeEventListener('scroll',this.lazyload);
	}

	componentWillReceiveProps(nextProps){
		var o = this.state.images[0]?this.state.images[0].key.toString():false;
		var n = nextProps.states.Wall.images[0].index.toString();
		if(o && o !== n){
			this.getImages(nextProps.states.Wall.images,true);
		};
	}

	shouldComponentUpdate(nextProps, nextState){

		return this.props.slideshow === nextProps.slideshow;
	}
	render(){
		var style = window.getComputedStyle(document.getElementById("wall"), null);
		var w = (Math.floor(style.width.replace('px','')*1/40));
		return(
			<div>
				<div id = 'imagesizer' ref = {(imagesizer)=>this.imagesizer = imagesizer} ></div>
				<XMasonry targetBlockWidth = {w} updateOnImagesLoad = 'false'>
					{this.state.images}
				</XMasonry>
				<div id='lazy' ref={(lazy)=>this.lazy=lazy}>{this.state.spinner && <FontAwesome name='spinner' spin size='2x' className='inner' />}</div>
			</div>
		)
	}
}


export class Wall extends Component {
	constructor(props,context){
		super(props,context);
		this.slideshow = this.slideshow.bind(this);
		this.update = this.update.bind(this);
		this.renew = this.renew.bind(this);
		this.wall = this.wall.bind(this);
		this.home = this.home.bind(this);
		this.refreshImages = this.refreshImages.bind(this);
		this.state = {
			slideshow:false,
			index:false,
			id:this.props.id,
			images:[],
			newpage:false
		};

	}

	update(props){
		if(!props) props = this.props
		this.setState({
			id:props.id,
			scrapemessage:false,
		});
		var states = props.states
		var functions = props.functions;
		var self = this;
		if(states.App.context === 'front'){
			crud.read('view','image','frontpage',{descending:true}).then(function(data){
				var images = data.rows.map(function(img){
					return img.value;
				})
				self.home(images);
			},function(err){
				console.error(err);
			})
			return;
		}

		if(props.newpage){
			this.renew(props.newpage.query,props.newpage.id,true);
			functions.App.newpage(false);
		}else{
			crud.read('show','image','backpage/'+props.id,{deleted:false}).then(function(page){
				self.wall(page);
			},function(err){
				console.error(err);
			})
		}
	}
	renew(query,id,added){

		if(!added && this.state.refresh) return;
		this.setState({
			refresh:true,
		})
		var self = this;
		if(added && query){
			this.setState({
				scrapemessage:'Scraping '+tools.sitename(query)+' for images...'
			});
		}

		scraper.scrape(query,id).then(function(parse){
			parse.process = parse.process.bind(self)
			parse.process(parse.json).then(function(page){
				crud.create(page.id,page).then(function(data){
					data.images = data.images.filter(function(img){
						return !img.deleted
					})
					if(added) self.props.functions.App.getPageList();
					data.images = tools.imageSort(data.images,'page');
					/*
					var moreimages = false
					if(self.state.images.length && data.id.toString()===self.state.id.toString()){
						console.log(data.images[0].index,self.state.images[0].index)
						if(data.images[0].index !== self.state.images[0].index){
							moreimages = true;
						}
					}
					*/
					self.wall(data);
				});
			},function(err){
				console.error(err);
				self.setState({
					scrapemessage:'There was an error while scraping the page...',
					refresh:false
				});
				if(added) setTimeout(function(){
					self.wall(false);
					if(self.context.router.history.length){
						self.context.router.history.goBack();
					}else{
						self.context.router.history.push('/');
					}
				},2000)
			})

		});
	}
	slideshow(index){
		if(this.state.slideshow){
			this.setState({
				slideshow:false
			})
			return;
		}else{
			this.setState({
				slideshow:true,
				index:index
			})
		}
	}
	wall(page){
		this.setState({
			images:page.images,
			description:tools.decode(page.description),
			title:tools.decode(page.title),
			link:page.link,
			refresh:false,
			newpage:false
		});
		this.props.functions.App.isloading(false);
	}
	home(images){
		this.setState({
			images:tools.imageSort(images,'front'),
			refresh:false,
			newpage:false
		})
		this.props.functions.App.isloading(false);
	}
	refreshImages(images){
		this.setState({
			images:images,
		})
	}
	componentDidMount(){
		this.update();
	}
	componentWillReceiveProps(Next){
		if(Next.id!==this.props.id || Next.newpage){
			this.update(Next);
			return;
		}
	}

	render(){

		var functions = this.props.functions;
		var states = this.props.states;
		functions.Wall = tools.getFunctions(this);
		states.Wall = this.state;

		if(states.App.isloading) return(
			<div id='wall'>
				<div className = 'progress'>
					<FontAwesome spin size='5x' name='refresh' />
					{this.state.scrapemessage && <div className='message'>{this.state.scrapemessage}</div>}
				</div>
			</div>
		)

		if(states.App.context === 'page'){
			return(
				<div id='wall'>
					<div id='head'>
						<div className = 'controls'>
							<div className = 'control ttParent'>
								<FontAwesome spin={this.state.refresh} size='lg' name='refresh' onClick = {()=>functions.Wall.renew(states.Wall.link,states.Wall.id)} />
								{!this.state.refresh && <Tooltip message = 'Look for more images' position='top' />}
							</div>
							{states.App.loggedin && (
							<div className = 'control ttParent'>
								<FontAwesome size='lg' name='trash-o' onClick = {()=>functions.App.delete(states.Wall.id)} />
								<Tooltip message = 'Delete Page' position='top' />
							</div>
							)}
						</div>
						<h2><a href={states.Wall.link} target='_blank'>{states.Wall.title}</a></h2>
						<p>{states.Wall.description}</p>
					</div>
					<div className='page widgets'><ImageList functions = {functions} states = {states} slideshow = {this.state.slideshow} /></div>
					<Slider functions = {functions} states = {states} />
				</div>

			)
		}else{
			return(
				<div id = 'wall'>
					<div className='front widgets'><ImageList  functions = {functions} states = {states} /></div>
				</div>
			)
		}
	}
}
Wall.contextTypes = {
  router: PropTypes.object
};
