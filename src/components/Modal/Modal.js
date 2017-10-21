import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import crud from '../../modules/crud.js';
import './Modal.css';

export class Modal extends Component {
	constructor(props){
		super(props);
		this.G = this.props.Global;
		this.state={
			username:'',
			password:'',
			modal:{
				open:false
			},
			loggedin:this.G('state').loggedin,
		}
		this.modal = this.modal.bind(this);
		this.G('modal',this.modal)

		this.modalMessage = this.modalMessage.bind(this);
		this.G('modalMessage',this.modalMessage)

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	modal(type,message){

		this.setState({
			modal:{
				open:this.state.modal.open?false:true,
				type:type,
				message:message||false
			}
		})
	}
	modalMessage(message){
		this.setState({
			modal:{
				open:this.state.modal.open,
				type:this.state.modal.type,
				message:message||false
			}
		})
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
					self.G("auth")(true);
					self.setState({
						username:'',
						password:''
					})
					self.modal(false);
				}else{
					self.setState({
						username:'',
						password:''
					})
					self.modalMessage('The login failed, check your credentials');
				}
			})
		};
	}
	componentWillReceiveProps(nextProps,nextState){
		this.setState({
			loggedin:this.G('state').loggedin
		})
	}
	shouldComponentUpdate(nextProps,nextState){
		return this.state.modal.open || this.state.modal.open!==nextState.modal.open
	}
	render(){
		//console.log('Modal rendered')
		return(
			<div id='modal' className={this.state.modal.open?'open':'closed'}>
				<div className='control close'>
					<FontAwesome name='times' size='2x' onClick={()=>{this.modal(false)}} />
				</div>
				<div className='inner'>
					{this.state.modal.type === 'login' && (
						<div className='column'>
							<h2>Login</h2>
							<form onSubmit={this.handleSubmit} name='login'>
								<input className='input' type='text' value={this.state.username} name='username' onChange = {this.handleChange} placeholder='Username' required />
								<input className='input' type='password' value={this.state.password} name='password' onChange = {this.handleChange} placeholder='Password' required />
								<input className='input' type="submit" value="Log In" />
							</form>
							{this.state.modal.message && <div className = 'failed message'>{this.state.modal.message}</div>}
						</div>
					)}
					{this.state.modal.type==='about' && (
						<div>ABOUT</div>
					)}
				</div>
			</div>
		)
	}
}
