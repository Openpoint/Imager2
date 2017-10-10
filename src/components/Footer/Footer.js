import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router-dom';
import tools from '../../modules/tools.js';
import {Tooltip} from '../Tooltip/Tooltip.js';
import './Footer.css';

class Controls extends Component {
	render(){
		var functions = this.props.functions;
		return(
			<div className='controls'>
				<div className = 'tower'>
					<div className='top'>
						<div className='left icon' onClick={()=>functions.Footer.nav('left')}><FontAwesome name='chevron-left' /></div>
						<div className='random icon ttParent' onClick={()=>functions.Footer.nav('random')}>
							<FontAwesome name='random' size="lg"/>
							<Tooltip message = 'Go to a random page' position='top' />
						</div>
						<div className='right icon' onClick={()=>functions.Footer.nav('right')}><FontAwesome name='chevron-right' /></div>
					</div>
				</div>
				<div className = 'home'>
				{this.props.states.App.context==='page' && (
					<Link to='/'><FontAwesome name='home' /></Link>
				)}
				</div>
			</div>
		)
	}
}
export class Footer extends Component {
	constructor(props,context){
		super(props,context);
		this.nav = this.nav.bind(this);
		this.seen = [];
	}
	nav(dir){
		var list = this.props.states.App.pages;
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
				this.context.router.history.push('/page/'+list[random]);
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
		if(dir!=='random') this.context.router.history.push('/page/'+list[this.in]);
	}
	render(){
		var states = this.props.states;
		var functions = this.props.functions;
		functions.Footer = tools.getFunctions(this);
		states.Footer = this.state;
		return(
			<div id='footer'>
				<div className='back'></div>
				<Controls functions={functions} states={states} />
			</div>
		)
	}
}
Footer.contextTypes = {
  router: PropTypes.object
};
