import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Logo} from '../Logo.js';
import FontAwesome from 'react-fontawesome';
import './Header.css';

export class Titlebar extends Component {
	constructor(props){
		super(props);
		this.state={open:false};
		this.menu = this.menu.bind(this);
		this.G = this.props.Global;
		this.state = {
			loggedin:this.G('state').loggedin,
			install:this.G('state').install
		}
	}
	menu(){
		this.setState({
			open:this.state.open?false:true
		})
	}
	componentWillReceiveProps(nextProps,nextState){
		this.setState({
			loggedin:this.G('state').loggedin,
			install:this.G('state').install
		})
	}

	shouldComponentUpdate(nextProps,nextState){

		return(
			nextState.install !== this.state.install ||
			nextState.loggedin !== this.state.loggedin ||
			nextState.open!==this.state.open
		)
	}


	render(){
		return(
			<div className='top' id='menu' >
				<Link to="/"><Logo /></Link>
				{this.state.install.installed && <FontAwesome name='bars' size='lg' className='menu item' onClick={()=>{this.menu()}}></FontAwesome>}
				{this.state.install.installed && (
					<menu className = {this.state.open?'open':'closed'}>
						{!this.state.loggedin && <div onClick={()=>{this.G('modal')('login')}} className='mitem'>Log In</div>}
						{this.state.loggedin && <div onClick={()=>{this.G('auth')(false)}} className='mitem'>Log Out</div>}
						<div className='mitem'>Favourites</div>
					</menu>
				)}
			</div>
		)
	}
}
