import React, {Component} from 'react';
import './Install.css';
import crud from '../../modules/crud.js';

export class Install extends Component {
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			install:this.props.install
		}
	}
	handleChange(event,form){
		var i = this.state[form];
		i[event.target.name] = event.target.value
		this.setState({
			[form]:i
		})
	}
	handleSubmit(event){
		//console.warn(event.target.name);
		event.preventDefault();
		var self = this;
		if(event.target.name === 'install'){
			crud.install(this.state.install).then(function(data){
				//console.log(data);
				if(data.error){
					self.setState({
						error:data.reason==='missing'?'Database "'+self.state.install.dbname+'" exists, but is not a valid Imager database':data.reason
					})
				}
				if(data.errno){
					self.setState({
						error:"Could not connect to couchDB at "+self.state.install.protocol+'://'+self.state.install.host+':'+self.state.install.couchport
					})
				}
				if(data.version||data.ok){
					var user = self.props.user;
					user.pass2 = ''
					self.setState({
						error:false,
						install:false,
						user:user,
						form:2
					})
				}
			})
		};
		if(event.target.name === 'adminuser'){
			crud.install(this.state.user).then(function(data){
				if(data.error){
					self.setState({
						error:data.reason
					})
				}
				if(data.ok){
					//console.warn('INSTALLED');
					crud.login({
						username:self.state.user.username,
						password:self.state.user.password
					}).then(function(data){
						//console.log(data);
						if(data.auth){
							window.location.reload();
						}else{
							console.error('login failed');
						}
					})
				}
			})
		};
	}
	render(){
		if(this.state.install) return(
			<div id='wrapper'>
				{this.state.error && <p className = 'error'>{this.state.error}</p>}
				<p>Imager requires CouchDB v2 or greater.</p>
				<form onSubmit={this.handleSubmit} name='install'>
					<label>Database Name</label>
					<input className='input' type='text' value={this.state.install.dbname} name='dbname' onChange = {(event)=>this.handleChange(event,'install')} required />
					<label>CouchDB Admin Name</label>
					<input className='input' type='text' value={this.state.install.dbadmin} name='dbadmin' onChange = {(event)=>this.handleChange(event,'install')} required />
					<label>CouchDB Admin Password</label>
					<input className='input' type='password' value={this.state.install.dbpass} name='dbpass' onChange = {(event)=>this.handleChange(event,'install')} required />
					<label>Database Protocol (https is untested)</label>
					<input className='input' type='text' value={this.state.install.protocol} name='protocol' onChange = {(event)=>this.handleChange(event,'install')} required />
					<label>Database Host</label>
					<input className='input' type='text' value={this.state.install.host} name='host' onChange = {(event)=>this.handleChange(event,'install')} required />
					<label>Database Port</label>
					<input className='input' type='text' value={this.state.install.couchport} name='couchport' onChange = {(event)=>this.handleChange(event,'install')} required />
					<input className='submit' type="submit" value="Install" />
				</form>
			</div>
		)
		return(
			<div id='wrapper'>
				{this.state.error && <p className = 'error'>{this.state.error}</p>}
				<p>Set up your Imager user</p>
				<form onSubmit={this.handleSubmit} name='adminuser'>
					<label>User Name</label>
					<input className='input' type='text' value={this.state.user.username} name='username' onChange = {(event)=>this.handleChange(event,'user')} required />
					<label>User Password</label>
					<input className='input' type='password' value={this.state.user.password} name='password' onChange = {(event)=>this.handleChange(event,'user')} required />
					<label>Confirm Password</label>
					<input className='input' type='password' value={this.state.user.pass2} name='pass2' onChange = {(event)=>this.handleChange(event,'user')} required />
					<label>Email</label>
					<input className='input' type='email' value={this.state.user.email} name='email' onChange = {(event)=>this.handleChange(event,'user')} required />
					<input className='submit' type="submit" value="Create" />
				</form>
			</div>
		)
	}
}
