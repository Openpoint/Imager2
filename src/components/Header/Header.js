import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Logo} from '../Logo.js';
import tools from '../../modules/tools.js';
import FontAwesome from 'react-fontawesome';
import './Header.css';

export class Titlebar extends Component {
	constructor(props){
		super(props);
		this.state={open:false};
		this.menu = this.menu.bind(this);

	}
	menu(){
		this.setState({
			open:this.state.open?false:true
		})
	}
	componentDidMount(){
		this.props.functions.App.menheight(this.men.offsetHeight);
	}
	render(){
		var functions = this.props.functions;
		var states = this.props.states;
		functions.Titlebar = tools.getFunctions(this);
		states.Titlebar = this.state;
		return(
			<div className='top' id='menu' ref={(men)=>this.men=men}>
				<Link to="/"><Logo /></Link>
				<FontAwesome name='bars' size='lg' className='menu item' onClick={()=>{this.menu()}}></FontAwesome>
				<menu className = {this.state.open?'open':'closed'}>
					{!states.App.loggedin && <div onClick={()=>{functions.App.modal('login')}} className='mitem'>Log In</div>}
					{states.App.loggedin && <div onClick={()=>{functions.App.auth(false)}} className='mitem'>Log Out</div>}
					<div className='mitem'>Favourites</div>
				</menu>
			</div>
		)
	}
}
