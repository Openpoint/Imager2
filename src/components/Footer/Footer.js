import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router-dom';
import {Tooltip} from '../Tooltip/Tooltip.js';
import crud from '../../modules/crud.js';
import tools from '../../modules/tools.js';
import './Footer.css';

class Controls extends Component {
	constructor(props){
		super(props);
		this.slideshow = this.slideshow.bind(this);
	}
	slideshow(){
		this.G('slideshow')('front');
	}
	render(){
		this.G = this.props.Global;

		return(
			<div className='controls'>
				<div className='extra left' style={{fontSize:".85em"}}>
					<div className='icon'>1</div>
					<div className='icon'>2</div>
					<div className='icon'>3</div>
				</div>
				<div className = 'tower'>
					<div className='top'>
						<div className='left icon' onClick={()=>this.G('nav')('left')}><FontAwesome name='chevron-left' /></div>
						<div className='random icon ttParent' onClick={()=>this.G('nav')('random')}>
							<FontAwesome name='random' size="lg"/>
							<Tooltip message = 'Go to a random page' position='top' />
						</div>
						<div className='right icon' onClick={()=>this.G('nav')('right')}><FontAwesome name='chevron-right' /></div>
					</div>
					<div className = 'home'>
						{this.G('state').Context === 'page' && (
							<Link to='/'><FontAwesome name='home' /></Link>
						)}
						{this.G('state').Context === 'front' && (
							<FontAwesome name='play-circle' size = 'lg' style={{cursor:'pointer'}} onClick={()=>this.slideshow()}/>
						)}
					</div>
				</div>

				<div className='extra right'>
					<div className='icon' onClick={()=>tools.scrolltop()}><FontAwesome name='arrow-up' /></div>
				</div>
			</div>
		)
	}
}
export class Footer extends Component {
	constructor(props){
		super(props);
		this.G = this.props.Global;

		this.nav = this.nav.bind(this);
		this.G('nav',this.nav);
		this.getPageList = this.getPageList.bind(this);
		this.G('getPageList',this.getPageList);

		this.state={
			Context:this.G('state').Context
		}

		this.getPageList();
		this.seen = [];
	}
	getPageList(){
		var self = this;

		crud.read('view','image','list',{descending:true}).then(function(data){
			console.log(data);
			var pages = data.rows.map(function(p){
				return p.value;
			})
			self.pages = pages;
			self.G('pages',pages);
		})

		crud.read('view','image','random').then(function(data){
			self.G('images',data.rows);
		})

	}
	nav(dir){
		var list = this.pages;
		var index = tools.getindex(this.G('location'));
		if(index) this.prev = index;

		switch(dir){
			case 'random':
				var seen = this.G('seen');
				if(seen.length === list.length){
					seen = [];
					this.G('seen',[])
				}
				this.prev?this.in=list.indexOf(this.prev):this.in=0;
				var list2 = list.filter(function(i){return seen.indexOf(i) === -1});;
				if(this.seen.length) list2 = list.filter(function(i){return this.seen.indexOf(i) === -1});
				var random = Math.floor((Math.random() * list2.length));
				this.G('history').push('/page/'+list2[random]);
			break;
			case 'left':
				this.prev?this.in=list.indexOf(this.prev):this.in=0;
				typeof this.in!=='undefined'?this.in--:this.in=0;
				if(this.in < 0) this.in = list.length - 1;
			break;
			case 'right':
				this.prev?this.in=list.indexOf(this.prev):this.in=-1;
				typeof this.in!=='undefined'?this.in++:this.in=0;
				if(this.in >= list.length) this.in = 0;

			break;
			default:
		}
		if(dir!=='random') this.G('history').push('/page/'+list[this.in]);
	}
	componentWillReceiveProps(nextProps,nextState){
		this.setState({
			Context:this.G('state').Context
		})
	}
	shouldComponentUpdate(){
		return this.G('state').Context !== this.state.Context
	}
	render(){
		//console.error('render the footer')
		return(
			<div id='footer'>
				<div className='back'></div>
				<Controls Global = {this.G} />
			</div>
		)
	}
}
