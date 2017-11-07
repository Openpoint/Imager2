import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import {Tooltip} from '../Tooltip/Tooltip.js';
import tools from '../../modules/tools.js';

export class Image extends Component {
	constructor(props){
		super(props);
		this.G = this.props.Global;
		this.reverse = this.reverse.bind(this);
		this.faviload = this.faviload.bind(this);
		this.loaded = 'loading';
		this.out = true;
		this.index = this.props.index;
		this.state = {
			loaded:'loading',
			vis:false,
			front:this.props.image.front,
			load:false
		}
	}
	reverse(event,url){
		if(event) event.stopPropagation();
		tools.getDataUri(url);
	}

	faviload(){
		this.setState({
			fav:true
		})
	}
	componentDidUpdate(){
		if(!this.state.load) this.ctx = null;
	}

	componentWillUnmount(){
		clearTimeout(this.to);
	}

	render(){
		this.props.image.info = this.props.image.title||''
		if(this.props.image.description) this.props.image.info +=' | '+this.props.image.description;
		var filetype = tools.filetype(this.props.image.src);
		if(this.G('state').Context === 'front'){
			return(
				<div className={[this.state.vis?'ani':'noani',this.state.loaded,'image'].join(' ')} onClick = {()=>this.G('history').push("/page/"+this.props.image.parent)} ref={(container)=>this.container = container}>
					<div className='iback group'>
						<div className='spacer' style={{height:0,marginTop:100/this.props.image.ratio+'%'}}></div>
					</div>
					{this.state.loaded === 'loading' && this.state.vis && filetype !== 'gif' &&(
							<div className = 'spinner'>
								<FontAwesome name = 'cog' spin size = '2x' />
							</div>
					)}
					{this.state.loaded === 'loading' && this.state.vis && filetype === 'gif' &&(
							<div className = 'spinner'>
								<FontAwesome name = 'play-circle-o' size = '2x' />
							</div>
					)}
					{this.state.loaded === 'error' && this.state.vis && (
						<div className = 'spinner'>
							<FontAwesome name = 'exclamation-triangle' size = '2x' style = {{display:this.state.vis?'inline':'none'}}/>
						</div>
					)}
					<div className={['ifront',this.state.vis?'visible':'hidden'].join(' ')} ref={(ifront)=>this.ifront = ifront}>

						{this.state.loaded === 'loading' && this.state.load && (
							<img alt = '' onLoad = {()=>this.G('imonload')(this,true)} onError = {()=>this.G('imonerror')(this)} src = {this.props.image.src} style = {{display:"none"}} ref = {(image)=>{
								if(image) this.image=image;
							}} />
						)}
						{this.state.loaded!=='error' && this.state.load && <canvas ref={(canvas)=>{
							if(canvas) this.canvas=canvas;
							if(canvas && this.image && this.image.complete) this.G('imonload')(this);
						}}/>}
						{filetype === 'gif' && this.state.vis && (
							<div>
								<img alt='' src = {this.props.image.src} className = 'gif' />
								<div className = 'gifplay'>
									<FontAwesome name = 'play-circle-o' />
								</div>
							</div>
						)}
					</div>
					{this.props.image.info && <div className = 'ttParent info' style = {{display:this.state.vis?'block':'none'}}>
						<Tooltip message = {tools.decode(this.props.image.info).substring(0,200)+'...'} position = 'bottom' />
					</div>}

					{this.props.image.favicon && <div className='favicon ttParent' style = {{display:this.state.vis?'flex':'none'}}>
						<a href={'http://'+tools.sitename(this.props.image.parenturl)} target = '_blank' onClick = {(event)=>event.stopPropagation()} >
							<img src={this.props.image.favicon} alt = 'favicon'  style = {{display:this.state.fav?'block':'none'}} onLoad = {()=>{
								this.setState({fav:true})
							}}/>
						</a>
						<Tooltip message = {tools.sitename(this.props.image.parenturl)} position = 'top' />
					</div>}
					<div className='index'>{this.props.index}</div>
				</div>
			)
		}else{
			return(
				<div className={[this.state.loaded,'image',this.props.image.class].join(' ')} data-top = {this.props.scroll} onClick = {()=>{this.G('slideshow')(this.index)}}  ref={(container)=>this.container = container}>
					<div className='iback group'>
						<div className='spacer' style={{height:0,marginTop:100/this.props.image.ratio+'%'}}></div>
					</div>
					{this.state.loaded === 'loading' && this.state.vis && filetype !== 'gif' &&(
							<div className = 'spinner'>
								<FontAwesome name = 'cog' spin size = '2x' />
							</div>
					)}
					{this.state.loaded === 'loading' && this.state.vis && filetype === 'gif' &&(
							<div className = 'spinner'>
								<FontAwesome name = 'play-circle-o' size = '2x' />
							</div>
					)}
					{this.state.loaded === 'error' && this.state.vis && (
						<div className = 'spinner'>
							<FontAwesome name = 'exclamation-triangle' size = '2x' style = {{display:this.state.vis?'inline':'none'}}/>
						</div>
					)}

					<div className={['ifront',this.state.vis?'visible':'hidden'].join(' ')} ref={(ifront)=>this.ifront = ifront} >

						{this.state.loaded === 'loading' && this.state.load && (
							<img alt = '' onLoad = {()=>this.G('imonload')(this)} onError = {()=>this.G('imonerror')(this)} src = {this.props.image.src} style = {{display:"none"}} ref = {(image)=>{
								if(image) this.image=image;
							}} />
						)}
						{this.state.loaded!=='error' && this.state.load && <canvas ref={(canvas)=>{
							if(canvas) this.canvas=canvas;
							if(canvas && this.image && this.image.complete) this.G('imonload')(this);
						}}/>}
						{filetype === 'gif' && this.state.vis && (
							<div>
								<img alt='' src = {this.props.image.src} className = 'gif' />
								<div className = 'gifplay'>
									<FontAwesome name = 'play-circle-o' />
								</div>
							</div>
						)}
					</div>

					{this.props.image.alt && <div className = 'ttParent info' style = {{display:this.state.vis?'block':'none'}}>
						<Tooltip message = {tools.decode(this.props.image.alt)} position = 'bottom' />
					</div>}

					{this.state.loaded !== 'loading' && <div className  = 'controls' style = {{display:this.state.vis?'block':'none'}}>
						{this.props.image.src.indexOf('data:')!==0 && <div className='control ttParent' onClick={(event)=>{this.reverse(event,this.props.image.src)}} >
							<FontAwesome name='google' />
							<Tooltip message = 'Reverse image lookup' position='top' />
						</div>}

						{this.props.image.url && this.props.image.urltitle && <div className='control ttParent'  onClick={(event)=>{event.stopPropagation()}}>
							<a href={this.props.image.url} target='_blank'><FontAwesome name='external-link' /></a>
							<Tooltip message = {'Visit page at: '+this.props.image.urltitle} position='top' />
						</div>}

						{!this.state.front && !this.props.image.deleted && (this.G('state').loggedin||this.props.image.temp) && (
							<div className='control ttParent' onClick={(event)=>{this.G('toFront')(event,this.index)}}  >
								<FontAwesome name='thumb-tack ' />
								<Tooltip message = 'Set as Front Image'  position='top' />
							</div>
						)}
						<div className='control ttParent' >
							<a href={this.props.image.src} download target='_blank'><FontAwesome name='download' /></a>
							<Tooltip message = 'Download Image' position='top' />
						</div>
						{(this.G('state').loggedin||this.props.image.temp) && (
							<div className='control ttParent' onClick={(event)=>{this.G('deleteSingle')(event,this.index,this)}} >
								<FontAwesome name={this.props.image.deleted?'check':'times'} />
								<Tooltip message = {this.props.image.deleted?'Restore Image':'Delete Image'} position='top' />
							</div>
						)}
					</div>}
					<div className='index'>{this.props.index}</div>
				</div>
			)
		}
	}
}
