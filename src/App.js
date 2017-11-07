import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route,withRouter} from 'react-router-dom';
import './css/App.css';
import {Wall} from './components/Wall/Wall.js';
import {Search} from './components/Search/Search.js';
import {Titlebar} from './components/Header/Header.js';
import {Footer} from './components/Footer/Footer.js';
import {Modal} from './components/Modal/Modal.js';
import {Install} from './components/Install/Install.js';
import crud from './modules/crud.js';
import tools from './modules/tools.js';

console.error(window.location);

crud.set(process.env._HOME,process.env.API_PORT)

const title = 'Imager';

class App extends Component {

		static propTypes = {
			match: PropTypes.object.isRequired,
			location: PropTypes.object.isRequired,
			history: PropTypes.object.isRequired
		}

	constructor(props){

		super(props);
		this.location = this.props.location;
		this.history = this.props.history;
		this.match = this.props.match;
		this.title = 'Imager';
		this.auth = this.auth.bind(this);
		this.delete = this.delete.bind(this);
		this.isloading = this.isloading.bind(this);
		this.seen = this.seen.bind(this);
		this.close = this.close.bind(this);
		this.Global = this.Global.bind(this);

		var con = this.location.pathname==='/'?'front':'page';
		this.state = {
			modal:{open:false},
			apptitle:title,
			loggedin:false,
			isloading:true,
			Context:con
		};

		var self = this;
		crud.checkToken().then(function(valid){
			if(valid.install){
				self.setState(valid);
				return;
			};
			if(valid === 'expired'){
				valid = false;
				self.modal('login','Your login expired, please log in again');
			}
			self.setState({
				loggedin:valid,
				install:{
					installed:true
				}
			})

		})
		this.path = this.location.pathname;
		this.Glob = {
			location:this.location,
			history:this.history,
			match:this.match,
			title:this.title,
			auth:this.auth,
			delete:this.delete,
			isloading:this.isloading,
			queue:[],
			seen:[],
		};
		this.seen();
		window.addEventListener('beforeunload',this.close);
	}
	close(){
		window.removeEventListener('beforeunload',this.close);
		var sleep = this.Glob.exit();
		this.Glob = null;
		this.setState({
			exit:true
		})
		if(sleep) tools.sleep(1000);
	}
	Global(name,f){
		if(!name && typeof f ==='undefined') return false;
		if(typeof f ==='undefined' ){
			if(name === 'state') this.Glob.state = this.state;
			return this.Glob[name];
		}
		this.Glob[name] = f;
	}
	auth(state){
		this.setState({
			loggedin:state
		})
		if(!state) crud.logout();
	}
	delete(id){
		var self = this;
		crud.delete(id).then(function(data){
			if(data.auth){
				self.history.push('/');
				self.Glob.getPageList();
			}
		})
	}

	isloading(state,context){
		this.reload = false;
		if(context && this.state.Context !== context) return;
		if(context) this.reload = true;
		this.setState({
			isloading:state,
			reload:this.reload
		});
	}
	seen(){
		var index = tools.getindex(this.location)
		if(index && this.Glob.seen.indexOf(index)===-1) this.Glob.seen.push(index);
	}
	componentWillReceiveProps(nextProps){

		this.location = nextProps.location;
		this.history = nextProps.history;
		this.match = nextProps.match;
		this.seen();

		this.Glob.location = this.location;
		if(this.path!==this.location.pathname){
			this.setState({isloading:true});
		}
		this.path = this.location.pathname;
		var con = this.location.pathname==='/'?'front':'page';

		if(con!==this.state.Context){
			this.setState({
				Context:con
			})
		}
	}
	componentWillUnmount(){
		console.log('App is unmounting');
		tools.sleep(1000);
	}
	shouldComponentUpdate(nextProps,nextState){
		if(this.Glob.temp && nextState.Context === 'front') return false;
		var up = (
			nextState.exit||
			nextState.reload ||
			nextState.isloading!==this.state.isloading ||
			nextState.Context!==this.state.Context ||
			nextState.install!==this.state.install ||
			nextState.loggedin!==this.state.loggedin
		)
		return up;
	}

	render() {
		//console.log('Render the App: id:'+this.location.pathname+' loggedin:'+this.state.loggedin+' isloading:'+this.state.isloading)
		if(!this.state.install||this.state.exit) return <div></div>
		if(this.state.install.installed) return (
			<div id="App" className={[this.state.Context,this.state.isloading?'isloading':null].join(' ')}>
				<div id='header'>
					<Titlebar  Global = {this.Global} />
					<Search Global = {this.Global} />
				</div>

				<Route path="/page/:id" exact render={({match}) => (
					<Wall id = {match.params.id} Global = {this.Global} />
				)} />
				<Route path="/" exact render={() => (
					<Wall id = 'front' Global = {this.Global} reload = {this.state.reload} />
				)} />
				<Footer Global = {this.Global} />
				<Modal Global = {this.Global} />
				<img src='/blank.png' alt = "" />
			</div>
		);
		return(
			<div id="App">
				<div id='header'>
					<Titlebar Global = {this.Global} />
				</div>
				<Install install = {this.state.install} user = {this.state.user} />
			</div>
		)
	}
}

export default withRouter(App)
