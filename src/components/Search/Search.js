import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Tooltip} from '../Tooltip/Tooltip.js';
import {Logo} from '../Logo.js';
import FontAwesome from 'react-fontawesome';
import SCRAPE from '../../modules/scrape.js';
import './Search.css';

const scraper = new SCRAPE(process.env.PUBLIC_URL,process.env.API_PORT);

const placeholders = {
	flickr:{
		message:'Search for images on FLICKR',
		parse:function(val){
			if(val.indexOf('http')===0) return false;
			return 'https://www.flickr.com/search/?text='+val;
		}
	},
	google:{
		message:'Search for images on Google',
		parse:function(val){
			if(val.indexOf('http')===0) return false;
			val = val.split(' ').join('+');
			return 'https://www.google.com/search?tbm=isch&source=hp&q='+val;
		}
	},
	getty:{
		message:'Search Getty Images',
		parse:function(val){
			if(val.indexOf('http')===0) return false;
			val = val.split(' ').join('-');
			return 'https://www.gettyimages.com/photos/'+val;
		}
	},
	link:{
		message:'Enter URL or search',
		parse:function(val){
			return val;
		}
	}
}

export class Search extends Component {
	constructor(props,context){
		super(props,context);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setsearch = this.setsearch.bind(this);
		this.fixsearch = this.fixsearch.bind(this);
		this.state = {value:'',type:'link'};

		window.addEventListener('scroll',()=>{
			this.fixsearch()
		})
	}
	fixsearch(menheight){
		if(!menheight) menheight = this.props.states.App.menheight;
		if(window.scrollY > menheight){
			if(!this.menupeg){
				this.menupeg = true;
				this.setState({menupeg:true})
			}
		}else{
			if(this.menupeg){
				this.menupeg = false;
				this.setState({menupeg:false})
			}
		}
	}
	setsearch(event,type){
		this.input.focus();
		this.setState({
			type:type
		})
	}
	handleChange(event){
		this.setState({value:event.target.value});
	}
	handleSubmit(event){
		event.preventDefault();
		var url = placeholders[this.state.type].parse(this.state.value);
		if(!url){
			url = placeholders.link.parse(this.state.value);
			this.setState({
				type:'link'
			})
		}
		if(!url) return;
		var newpage = scraper.getpage(url);
		if(!newpage.query){
			url = placeholders.google.parse(this.state.value);
			newpage = scraper.getpage(url);
			this.setState({
				type:'google'
			})
		}
		this.props.functions.App.newpage(newpage);
		this.setState({value:''});
	}
	componentWillReceiveProps(props){
		var menheight = props.states.App.menheight
		if(window.scrollY > menheight){
			this.menupeg = false;
		}else{
			this.menupeg = true;
		}
		this.fixsearch(menheight);
	}
	render(){
		return(
			<div id='search' className={this.state.menupeg?'sticky':'free'}>
			<form onSubmit={this.handleSubmit} ref={(search)=>this.search=search}>
				<input type='text' value={this.state.value} onChange = {this.handleChange} placeholder={placeholders[this.state.type].message} ref={(input)=>this.input=input}/>
				<div className='controls'>
					<div className='control'><Link to="/"><Logo /></Link></div>
					<div className={['control ttParent',this.state.type==='flickr'?'bold':''].join(' ')} >
						<FontAwesome name='flickr' onClick={(event)=>this.setsearch(event,'flickr')}/>
						<Tooltip message='Search on FLICKR' position='bottom' />
					</div>
					<div className={['control ttParent',this.state.type==='google'?'bold':''].join(' ')} >
						<FontAwesome name='google'  onClick={(event)=>this.setsearch(event,'google')}/>
						<Tooltip message='Search on Google' position='bottom'/>
					</div>
					<div className={['control ttParent',this.state.type==='getty'?'bold':''].join(' ')} >
						<span onClick={(event)=>this.setsearch(event,'getty')}>Ge</span>
						<Tooltip message='Search on Getty images' position='bottom' />
					</div>
					<div className={['control ttParent',this.state.type==='link'?'bold':''].join(' ')} >
						<FontAwesome name='link' onClick={(event)=>this.setsearch(event,'link')} />
						<Tooltip message='Enter an URL' position='bottom' />
					</div>
				</div>
			</form>
			</div>
		)
	}
}

Search.contextTypes = {
  router: PropTypes.object
};
