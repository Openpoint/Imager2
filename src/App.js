import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import './css/App.css';
import tools from './modules/tools.js';
import {Wall} from './components/Wall/Wall.js';
import {Search} from './components/Search/Search.js';
import {Titlebar} from './components/Header/Header.js';
import {Footer} from './components/Footer/Footer.js';
import {Modal} from './components/Modal/Modal.js';
import crud from './modules/crud.js';

crud.set(process.env.PUBLIC_URL,process.env.API_PORT)

const title = 'Imager';

class App extends Component {
	constructor(props,context){
		super(props,context);
		this.title = 'Imager';
		this.modal = this.modal.bind(this);
		this.auth = this.auth.bind(this);
		this.modalMessage = this.modalMessage.bind(this);
		this.delete = this.delete.bind(this);
		this.getPageList = this.getPageList.bind(this);
		this.menheight = this.menheight.bind(this);
		this.newpage = this.newpage.bind(this);
		this.isloading = this.isloading.bind(this);
		var con = this.context.router.route.location.pathname==='/'?'front':'page';
		this.state = {
			modal:{open:false},
			apptitle:title,
			loggedin:false,
			isloading:true,
			context:con
		};
		this.getPageList();
		var self = this;
		crud.checkToken().then(function(valid){
			if(valid === 'expired'){
				valid = false;
				self.modal('login','Your login expired, please log in again');
			}
			self.setState({
				loggedin:valid
			})
		})
		this.path = context.router.route.location.pathname;
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
				self.context.router.history.push('/');
				self.getPageList();
			}
		})
	}
	getPageList(){
		var self = this;
		crud.read('view','image','list',{descending:true}).then(function(data){
			var pages = data.rows.map(function(p){
				return p.value;
			})
			self.setState({
				pages:pages
			})
		})
	}
	menheight(h){
		this.setState({menheight:h})
	}
	newpage(newpage){
		this.newPage = newpage;
		if(!newpage) return;
		this.context.router.history.push('/page/'+newpage.id);
	}
	isloading(state){
		this.setState({isloading:state});
	}
	componentWillReceiveProps(nextProps,nextContext){
		if(this.path!==nextContext.router.route.location.pathname){
			this.setState({isloading:true});
		}
		this.path = nextContext.router.route.location.pathname;
		var con = nextContext.router.route.location.pathname==='/'?'front':'page'
		if(con!==this.state.context) this.setState({
			context:con
		})
	}
	render() {
		var functions = {App:tools.getFunctions(this)};
		var states = {App:this.state};
		return (
			<div id="App" className={[this.state.context,this.state.isloading?'isloading':null].join(' ')}>
				<div id='header'>
					<Titlebar functions = {functions} states = {states}/>
					<Search functions = {functions} states = {states} />
				</div>
				<Route path="/page/:id" exact render={({match}) => (
					<Wall id = {match.params.id} functions = {functions} states = {states} newpage = {this.newPage}/>
				)} />
				<Route path="/" exact render={() => (
					<Wall id = 'front' functions = {functions} states = {states} />
				)} />
				<Footer functions = {functions} states = {states}/>
				<Modal functions = {functions} states = {states}/>
			</div>
		);
	}
}

App.contextTypes = {
  router: PropTypes.object
};
export default App;
