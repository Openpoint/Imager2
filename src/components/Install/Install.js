import React, {Component} from 'react';
import './Install.css';
import crud from '../../modules/crud.js';

export class Install extends Component {
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validate = this.validate.bind(this);
		this.vinit = this.vinit.bind(this);
		this.state = {
			install:this.props.install,
			confirmpass:"Confirm your password"
		}
	}
	vinit(){
		this.formfields = [];
		Object.keys(this.form).forEach((key)=>{
			if(this.form[key].required) this.formfields.push(this.form[key].name);
		});
		this.validate(this.form.name);
	}
	validate(form){
		if(!this.formfields.some((key)=>{
			if(form === 'user' && (this.state.user.password !== this.state.user.pass2)){
				if(this.state.user.password && this.state.confirmpass){
					this.setState({confirmpass:false})
				}else if(!this.state.user.password && !this.state.confirmpass){
					this.setState({confirmpass:"Confirm your password"})
				}
				return true;
			}else if(form === 'user' && this.state.user.password && this.state.user.password === this.state.user.pass2){
				this.setState({confirmpass:"Passwords Match"})
			}else{
				this.setState({confirmpass:"Confirm your password"})
			}
			var input = document.querySelector('.input[name="'+key+'"]');
			return !input.validity.valid
		})){
			this.submit.disabled = false;
		}else{
			this.submit.disabled = true;
		}
	}
	handleChange(event,form){
		var i = this.state[form];

		if(event.target.name === 'pass2'){
			event.target.valid = (event.target.value === i.password)
		}
		i[event.target.name] = event.target.value
		this.setState({
			[form]:i
		},()=>this.validate(form))
	}
	handleSubmit(event){
		console.warn(event.target.name);
		event.preventDefault();
		var self = this;
		if(event.target.name === 'install'){
			crud.install(this.state.install).then(function(data){
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
		if(event.target.name === 'user'){
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
	componentDidUpdate(prevProps, prevState){
		if(prevState.form !== this.state.form) this.vinit();
	}
	componentDidMount(){
		this.vinit();
	}
	render(){
		if(this.state.install) return(
			<div id='wrapper'>
				{this.state.error && <p className = 'error'>{this.state.error}</p>}
				<p>Imager requires CouchDB v2 or greater.</p>
				<form onSubmit={this.handleSubmit} name='install' ref = {(form)=>{
					if(!form) return;
					this.form = form;
				}}>
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
					<input className='submit' type="submit" value="Install" ref = {(submit)=>this.submit = submit}/>
				</form>
			</div>
		)
		return(
			<div id='wrapper'>
				{this.state.error && <p className = 'error'>{this.state.error}</p>}
				<p>Set up your Imager user</p>
				<form onSubmit={this.handleSubmit} name='user' ref = {(form)=>{
					if(!form) return;
					this.form = form;
				}}>
					<label>User Name</label>
					<input className='input' type='text' value={this.state.user.username} name='username' onChange = {(event)=>this.handleChange(event,'user')} required />
					<label>User Password</label>
					<input className='input' type='password' value={this.state.user.password} name='password' onChange = {(event)=>this.handleChange(event,'user')} required autocomplete="new-password"/>
					<label>{this.state.confirmpass?this.state.confirmpass:"Passwords do not match"}</label>
					<input className='input' type='password' value={this.state.user.pass2} name='pass2' onChange = {(event)=>this.handleChange(event,'user')} required  autocomplete="new-password"/>
					<label>Email</label>
					<input className='input' type='email' value={this.state.user.email} name='email' onChange = {(event)=>this.handleChange(event,'user')} required />
					<input className='submit' type="submit" value="Create"  ref = {(submit)=>this.submit = submit} />
				</form>
			</div>
		)
	}
}
