import React, { Component } from 'react';
import {ImageList} from './ImageList.js';
import FontAwesome from 'react-fontawesome';
import {Tooltip} from '../Tooltip/Tooltip.js';
import {Slider} from '../Slider/Slider.js';
import SCRAPE from '../../modules/scrape.js';
import {LoadImages} from './LoadImages.js';
import crud from '../../modules/crud.js';
import tools from '../../modules/tools.js';
import './Wall.css';
const scraper = new SCRAPE(process.env.PUBLIC_URL,process.env.API_PORT);


export class Wall extends Component {
	constructor(props){
		super(props);

		this.G = this.props.Global;
		this.update = this.update.bind(this);
		this.renew = this.renew.bind(this);
		this.wall = this.wall.bind(this);
		this.home = this.home.bind(this);
		this.recieve = this.recieve.bind(this);
		this.G("send",this.recieve)
		this.clear = this.clear.bind(this);
		this.remove = this.remove.bind(this);
		this.state = {
			slideshow:false,
			id:this.props.id,
			page:{images:[]},
			loggedin:this.G('state').loggedin,
			isloading:this.G('state').isloading
		};
		this.p={};
	}

	remove(){
		this.G('tempdeleted',true);
		this.G('history').push('/');
	}
	update(props){
		if(!props) props = this.props;
		this.clear()

		this.setState({
			id:props.id,
			scrapemessage:false,
			description:false,
			title:false,
			link:false,
			refresh:false,
		});

		var self = this;
		if(this.G('state').Context === 'front'){
			this.p.front = crud.read('view','image','frontpage',{descending:true}).then(function(data){
				console.log('got front')
				var images = data.rows.map(function(img){
					return img.value;
				})
				self.home(images);
			},function(err){
				console.error(err);
			})
			return;
		}
		var newpage = this.G('newpage')
		if(newpage){
			this.renew(newpage.query,newpage.id,true);
			this.G('newpage',false);
		}else{
			this.p.back = crud.read('show','image','backpage/'+props.id,{deleted:false}).then(function(page){
				console.log('got page')
				self.G('allims',page.images);
				self.wall(page);
			},function(err){
				console.error(err);
			})
		}
	}
	renew(query,id,added){
		if((!added && this.state.refresh)||!query) return; //stop incessant user behaviour on the refresh button
		if(!added) this.G('pageupdate',true);
		this.setState({
			refresh:true,
			scrapemessage:'Scraping '+tools.sitename(query)+' for images...'
		})
		var self = this;
		this.p.scrape = scraper.scrape(query,id).then(function(data){
			if(data.images && data.images.length){
				self.G('loadimages',data);
				self.setState({
					scrapemessage:'Checking '+data.images.length+' images...'
				})
			}else{
				self.G('loadimages',false);
				self.setState({
					scrapemessage:'No useable images were found on '+tools.sitename(query),
					refresh:false,
				});
			}
		},function(err){
			console.error(err);
			self.setState({
				scrapemessage:'There was an error while scraping the page...',
				refresh:false,
			});
			if(added) self.redirect = setTimeout(function(){
				self.wall(false);
				if(self.G('history').length){
					self.G('history').goBack();
				}else{
					self.G('history').push('/');
				}
			},2000)
		});
	}
	recieve(page){
		if(typeof page.message !=='undefined'){
			var message,refresh;
			typeof page.message === 'string'?message = page.message:message = 'Checking '+page.message+' images...';
			typeof page.message === 'string'?refresh = false:refresh = true;
			this.setState({
				scrapemessage:message,
				refresh:refresh,
			})
			return;
		}
		this.G('loadimages',false)
		if(!this.G('allims')){
			this.G('allims',page.images);
		}else{
			var allims = this.G('allims');
			allims = allims.concat(page.images);
			this.G('allims',allims);
		}
		if(this.G('page').images) page.images = page.images.concat(this.G('page').images)
		page.images = tools.imageSort(page.images,'page');
		this.wall(page);
	}

	wall(page){
		if(!page.images || !page.images.length){
			this.G('page',false);
			this.setState({
				description:tools.decode(page.description),
				title:tools.decode(page.title),
				link:page.link,
				refresh:false,
				scrapemessage:"No images were found for the page",
				nogood:true
			});
			this.G('isloading')(true);
			return;
		}
		page.images = page.images.filter(function(im){
			return !im.deleted;
		})
		this.G('page',page);
		this.setState({
			description:tools.decode(page.description),
			title:tools.decode(page.title),
			link:page.link,
			refresh:false,
			scrapemessage:false,
			nogood:false
		});
		this.G('isloading')(false);
	}

	home(images){
		this.G('page',{
			images:tools.imageSort(images,'front')||[],
		});
		this.setState({
			refresh:false,
			scrapemessage:false,
			nogood:false
		})
		this.G('isloading')(false);
	}
	clear(){

		this.G('loadimages',false);
		this.G('allims',false);
		clearTimeout(this.redirect);
		tools.cancel(this.p);
	}
	componentDidMount(){
		this.update();
	}
	componentWillUnmount(){
		this.G('pageupdate',false);
		this.clear();
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			loggedin:this.G('state').loggedin,
			isloading:this.G('state').isloading,
			id:nextProps.id
		})
		if(nextProps.id!==this.props.id || this.G('newpage') || nextProps.reload){
			this.clear();
			this.update(nextProps);
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		return(
			nextProps.id!==this.props.id ||
			nextProps.reload ||
			this.state.isloading !== nextState.isloading ||
			this.state.scrapemessage !== nextState.scrapemessage ||
			this.state.loggedin !== nextState.loggedin
		)
	}

	render(){
		//console.warn('Render the Wall: '+this.state.isloading);
		if(this.state.isloading) return(
			<div id='wall'>
				{this.state.nogood && <div id='head'>
					<div className = 'controls'>
						<div className = 'control ttParent'>
							<FontAwesome spin={this.state.refresh} size='lg' name='refresh' onClick = {()=>this.renew(this.state.link,this.state.id)} />
							<Tooltip message = {this.state.scrapemessage||'Look for more images'} position='top' />
						</div>
						{(this.state.loggedin||this.state.page.temp) && (
						<div className = 'control ttParent'>
							{this.state.loggedin && !this.G('page').temp && <FontAwesome size='lg' name='trash-o' onClick = {()=>this.G('delete')(this.state.id)} />}
							{this.G('page').temp && <FontAwesome size='lg' name='trash-o' onClick = {()=>this.remove()} />}
							<Tooltip message = 'Delete Page' position='top' />
						</div>
						)}
					</div>
					<h2><a href={this.state.link} target='_blank'>{this.state.title||'Untitled'}</a></h2>
					<p>{this.state.description}</p>
				</div>}
				<div className = 'progress'>
					{!this.state.nogood && <FontAwesome spin size='5x' name='refresh' />}
					{this.state.nogood && <FontAwesome size='5x' name='exclamation-triangle' />}
					{this.state.scrapemessage && <div className='message'>{this.state.scrapemessage}</div>}
				</div>
				{this.G('loadimages') && <LoadImages Global = {this.G} />}
			</div>
		)

		if(this.G('state').Context === 'page'){
			return(
				<div id='wall'>
					{this.G('loadimages') && <LoadImages Global = {this.G}/>}
					<div id='head'>
						<div className = 'controls'>
							{this.state.loggedin && <div className = 'control ttParent'>
								<FontAwesome spin={this.state.refresh} size='lg' name='refresh' onClick = {()=>this.renew(this.state.link,this.state.id)} />
								<Tooltip message = {this.state.scrapemessage||'Look for more images'} position='top' />
							</div>}
							{(this.state.loggedin||this.G('page').temp) && (
							<div className = 'control ttParent'>
								{this.state.loggedin && (!this.G('page').temp || this.G('pageupdate')) && <FontAwesome size='lg' name='trash-o' onClick = {()=>this.G('delete')(this.state.id)} />}
								{this.G('page').temp && !this.G('pageupdate') && <FontAwesome size='lg' name='trash-o' onClick = {()=>this.remove()} />}
								<Tooltip message = 'Delete Page' position='top' />
							</div>
							)}
						</div>
						<h2><a href={this.state.link} target='_blank'>{this.state.title||'Untitled'}</a></h2>
						<p>{this.state.description}</p>
					</div>
					<div className='page widgets'>
						{this.G('page') && this.G('page').images.length && <ImageList Global = {this.G} />}
					</div>
					<Slider Global = {this.G}/>
				</div>

			)
		}else{
			return(
				<div id = 'wall'>
					<div className='front widgets'>
						{this.G('page') && this.G('page').images.length && <ImageList Global = {this.G} />}
					</div>
				</div>
			)
		}
	}
}
