import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router-dom';
import {Tooltip} from '../Tooltip/Tooltip.js';
import crud from '../../modules/crud.js';
import './Footer.css';

class Controls extends Component {
	render(){
		this.G = this.props.Global;

		return(
			<div className='controls'>
				<div className = 'tower'>
					<div className='top'>
						<div className='left icon' onClick={()=>this.G('nav')('left')}><FontAwesome name='chevron-left' /></div>
						<div className='random icon ttParent' onClick={()=>this.G('nav')('random')}>
							<FontAwesome name='random' size="lg"/>
							<Tooltip message = 'Go to a random page' position='top' />
						</div>
						<div className='right icon' onClick={()=>this.G('nav')('right')}><FontAwesome name='chevron-right' /></div>
					</div>
				</div>
				<div className = 'home'>
				{this.G('state').Context === 'page' && (
					<Link to='/'><FontAwesome name='home' /></Link>
				)}
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
			var pages = data.rows.map(function(p){
				return p.value;
			})
			self.pages = pages;
		})
	}
	nav(dir){
		var list = this.pages;
		switch(dir){
			case 'random':
				var list2 = [];
				if(this.seen.length) list2 = list.filter(function(i){return this.seen.indexOf(i) === -1});
				if(list2.length){
					list = list2;
				}else if(this.seen.length){
					this.seen  = [];
				}
				var random = Math.floor((Math.random() * list.length));
				this.G('history').push('/page/'+list[random]);
			break;
			case 'left':
				typeof this.in!=='undefined'?this.in--:this.in=0;
				if(this.in < 0) this.in = list.length - 1;
			break;
			case 'right':
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
