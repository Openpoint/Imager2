import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import crud from '../../modules/crud.js';
import './Modal.css';

export class Modal extends Component {
	constructor(props){
		super(props);
		this.state={
			username:'',
			password:''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChange(event){
		this.setState({
			[event.target.name]:event.target.value
		})
	}
	handleSubmit(event){
		event.preventDefault();
		var self = this;
		if(event.target.name === 'login'){
			crud.login({
				username:this.state.username,
				password:this.state.password
			}).then(function(data){

				if(data.auth){
					self.props.functions.App.auth(true);
					self.setState({
						username:'',
						password:''
					})
					self.props.functions.App.modal(false);
				}else{
					self.setState({
						username:'',
						password:''
					})
					self.props.functions.App.modalMessage('The login failed, check your credentials');
				}
			})
		};
	}
	render(){
		var functions = this.props.functions;
		var states = this.props.states;
		var type = states.App.modal.type;

		return(
			<div id='modal' className={states.App.modal.open?'open':'closed'}>
				<div className='control close'>
					<FontAwesome name='times' size='2x' onClick={()=>{functions.App.modal(false)}} />
				</div>

				<div className='inner'>
					{type==='login' && (
						<div className='column'>
							<h2>Login</h2>
							<form onSubmit={this.handleSubmit} name='login'>
								<input className='input' type='text' value={this.state.username} name='username' onChange = {this.handleChange} placeholder='Username' required />
								<input className='input' type='password' value={this.state.password} name='password' onChange = {this.handleChange} placeholder='Password' required />
								<input className='input' type="submit" value="Log In" />
							</form>
							{states.App.modal.message && <div className = 'failed message'>{states.App.modal.message}</div>}
						</div>
					)}
					{type==='about' && (
						<div>ABOUT</div>
					)}
				</div>
			</div>
		)
	}
}
