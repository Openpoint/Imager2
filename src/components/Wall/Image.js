import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import {Tooltip} from '../Tooltip/Tooltip.js';
import tools from '../../modules/tools.js';


export class Image extends Component {
	constructor(props){
		super(props);

		this.G = this.props.Global;
		this.reverse = this.reverse.bind(this);
		this.imonload = this.imonload.bind(this);
		this.imonerror = this.imonerror.bind(this);
		this.makecanvas = this.makecanvas.bind(this);
		this.loaded = 'loading';
		this.ix = this.props.index;
		this.vis = false;
		this.state = {
			loaded:'loading',
			front:this.props.image.front,
			load:false
		}
	}
	imonload(){
		if(this.finished || !this.state.load || this.abort) return;
		this.finished = true;
		this.makecanvas();
		/*
		this.I.onload = null;
		this.I.onerror = null;
		this.I=null;
		*/
		this.props.next();
		this.setState({
			loaded:'loaded'
		});
	}
	imonerror(){
		if(this.finished || !this.state.load || this.abort) return;
		this.finished = true;
		/*
		this.I.onload = null;
		this.I.onerror = null;
		this.I=null;
		this.CTX = null;
		*/
		this.canvas = null;
		this.props.next();
		this.setState({
			loaded:'error',
		});
	}
	//put an image to canvas
	makecanvas(){
		var width = Math.round(document.getElementById('wall').offsetWidth/40*this.props.w);
		var height = Math.round(width/this.props.image.ratio);
		this.canvas.width = width;
		this.canvas.height = height;
		this.CTX = this.canvas.getContext("2d");
		this.CTX.drawImage(this.I,0,0,width,height);
	}
	reverse(event,url){
		if(event) event.stopPropagation();
		tools.getDataUri(url);
	}
	componentWillReceiveProps(nextProps){
		this.ix = nextProps.index;
	}
	componentWillUpdate(nextProps, nextState){
		if(!nextState.load){
			this.CTX = null;
			this.I = null;
			this.canvas = null;
			this.abort = true;

			/*
			this.canvas = null;
			this.CTX = null;
			if(this.I){
				this.I.onload = null;
				this.I.onerror = null;
			}
			this.I = null;
			*/
		}else{
			this.abort = false;
		}
	}
	componentWillUnmount(){
		this.abort = true;
		/*
		this.canvas = null;
		this.CTX = null;
		if(this.I){
			this.I.onload = null;
			this.I.onerror = null;
		}
		this.I = null;
		*/
	}

	render(){
		if(!this.state.load) return null;
		this.props.image.info = this.props.image.title||''
		if(this.props.image.description) this.props.image.info +=' | '+this.props.image.description;
		var filetype = tools.filetype(this.props.image.src);
		if(this.G('state').Context === 'front'){
			return(
				<div className={[this.state.loaded,'inner'].join(' ')} onClick = {()=>this.G('history').push("/page/"+this.props.image.parent)}>
					{this.state.loaded === 'loading' && filetype !== 'gif' &&(
							<div className = 'spinner opt'>
								<FontAwesome name = 'cog' spin size = '2x' />
							</div>
					)}
					{this.state.loaded === 'loading' && filetype === 'gif' &&(
							<div className = 'spinner opt'>
								<FontAwesome name = 'play-circle-o' size = '2x' />
							</div>
					)}
					{this.state.loaded === 'error' && (
						<div className = 'spinner opt'>
							<FontAwesome name = 'exclamation-triangle' size = '2x' />
						</div>
					)}
					<div className='ifront'>
						{this.state.loaded === 'loading' && this.state.load && (
							<img className='opt' alt = '' onLoad = {()=>this.imonload()} onError = {()=>this.imonerror()} src = {this.props.image.src} style = {{display:"none"}} ref = {(image)=>{
								if(image && !this.I) this.I=image;
							}} />
						)}
						{this.state.loaded!=='error' && this.state.load && <canvas className='opt' ref={(canvas)=>{
							if(canvas && !this.canvas) this.canvas=canvas;
							if(this.canvas && this.I && this.I.complete) this.imonload();
						}}/>}
						{filetype === 'gif' && this.state.loaded === 'loaded' && (
							<div className='opt'>
								<img alt='' src = {this.props.image.src} className = 'gif' />
								<div className = 'gifplay'>
									<FontAwesome name = 'play-circle-o' />
								</div>
							</div>
						)}
					</div>
					{this.props.image.info && <div className = 'ttParent info opt'>
						<Tooltip message = {tools.decode(this.props.image.info).substring(0,200)+'...'} position = 'bottom' />
					</div>}
					{this.state.load && this.state.loaded !== 'loading' && this.props.image.favicon && <div className='favicon ttParent opt' >
						<a href={'http://'+tools.sitename(this.props.image.parenturl)} target = '_blank' onClick = {(event)=>event.stopPropagation()} >
							<img id={'fav-'+this.props.image.index} src={this.props.image.favicon} alt = 'favicon' data-vis={false} onLoad = {()=>{
								document.getElementById('fav-'+this.props.image.index).setAttribute('data-vis',true);
							}}/>
						</a>
						<Tooltip message = {tools.sitename(this.props.image.parenturl)} position = 'top right' />
					</div>}
					{this.state.load && this.state.loaded !== 'loading' && <div className  = 'controls opt'>
						{this.props.image.src.indexOf('data:')!==0 && <div className='control ttParent' onClick={(event)=>{this.reverse(event,this.props.image.src)}} >
							<FontAwesome name='google' />
							<Tooltip message = 'Reverse image lookup' position='top' />
						</div>}
						{this.props.image.url && this.props.image.urltitle && <div className='control ttParent' onClick={(event)=>{event.stopPropagation()}}>
							<a href={this.props.image.url} target='_blank'><FontAwesome name='external-link' /></a>
							<Tooltip message = {'Image source: '+this.props.image.urltitle} position='top left' width = '200'/>
						</div>}
						<div className='control ttParent' >
							<a href={this.props.image.src} download target='_blank' onClick={(event)=>{event.stopPropagation()}}><FontAwesome name='download' /></a>
							<Tooltip message = 'Download Image' position='top left' />
						</div>
					</div>}
					<div className='index opt'>{this.ix}</div>
				</div>
			)
		}else{
			return(
				<div className={[this.state.loaded,'inner'].join(' ')} onClick = {()=>{this.G('slideshow')(this.ix)}} >
					{this.state.loaded === 'loading' && filetype !== 'gif' &&(
							<div className = 'spinner opt'>
								<FontAwesome name = 'cog' spin size = '2x' />
							</div>
					)}
					{this.state.loaded === 'loading' && filetype === 'gif' &&(
							<div className = 'spinner opt'>
								<FontAwesome name = 'play-circle-o' size = '2x' />
							</div>
					)}
					{this.state.loaded === 'error' && (
						<div className = 'spinner opt'>
							<FontAwesome name = 'exclamation-triangle' size = '2x' />
						</div>
					)}

					<div className='ifront' ref={(ifront)=>this.ifront = ifront} >

						{this.state.loaded === 'loading' && this.state.load && (
							<img className='opt' alt = '' onLoad = {()=>this.imonload()} onError = {()=>this.imonerror()} src = {this.props.image.src} style = {{display:"none"}} ref = {(image)=>{
								if(image && !this.I) this.I=image;
							}} />
						)}
						{this.state.loaded!=='error' && this.state.load && <canvas className='opt' ref={(canvas)=>{
							if(canvas && !this.canvas) this.canvas=canvas;
							if(this.canvas && this.I && this.I.complete) this.imonload();
						}}/>}
						{filetype === 'gif' && this.state.loaded === 'loaded' && (
							<div className='opt'>
								<img alt='' src = {this.props.image.src} className = 'gif' />
								<div className = 'gifplay'>
									<FontAwesome name = 'play-circle-o' />
								</div>
							</div>
						)}
					</div>

					{this.props.image.alt && <div className = 'ttParent info opt' >
						<Tooltip message = {tools.decode(this.props.image.alt)} position = 'bottom' />
					</div>}

					{this.state.load && this.state.loaded !== 'loading' && <div className  = 'controls opt'>
						{this.props.image.src.indexOf('data:')!==0 && <div className='control ttParent' onClick={(event)=>{this.reverse(event,this.props.image.src)}} >
							<FontAwesome name='google' />
							<Tooltip message = 'Reverse image lookup' position='top' />
						</div>}

						{this.props.image.url && this.props.image.urltitle && <div className='control ttParent' onClick={(event)=>{event.stopPropagation()}}>
							<a href={this.props.image.url} target='_blank'><FontAwesome name='external-link' /></a>
							<Tooltip message = {'Visit page at: '+this.props.image.urltitle} position='top' width = '200'/>
						</div>}

						{!this.state.front && !this.props.image.deleted && (this.G('state').loggedin||this.props.image.temp) && (
							<div className='control ttParent' onClick={(event)=>{event.stopPropagation();this.G('toFront')(this.ix)}}  >
								<FontAwesome name='thumb-tack ' />
								<Tooltip message = 'Set as Front Image'  position='top' />
							</div>
						)}
						<div className='control ttParent' >
							<a href={this.props.image.src} download target='_blank' onClick={(event)=>{event.stopPropagation()}}><FontAwesome name='download' /></a>
							<Tooltip message = 'Download Image' position='top' />
						</div>
						{(this.G('state').loggedin||this.props.image.temp) && (
							<div className='control ttParent' onClick={(event)=>{event.stopPropagation();this.G('deleteSingle')(this.ix)}} >
								<FontAwesome name={this.props.image.deleted?'check':'times'} />
								<Tooltip message = {this.props.image.deleted?'Restore Image':'Delete Image'} position='top' />
							</div>
						)}
					</div>}
					<div className='index opt'>{this.ix}</div>
				</div>
			)
		}
	}
}
