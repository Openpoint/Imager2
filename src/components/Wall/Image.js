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
		tools.getDataUri(url)
	}

	faviload(){
		this.setState({
			fav:true
		})
	}


	componentWillUnmount(){
		clearTimeout(this.to);
		if(this.ctx){
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx = null;
		}
	}
	componentDidUpdate(){
		/*
		if(this.image && !this.image.src){
			this.image.onload = ()=>this.G('imload')(this);
			this.image.onerror = ()=>this.G('imerror')(this)
			this.image.src = this.props.image.src;
		}
		*/
	}
	render(){
		var image = this.props.image;
		/*
		return(
			<div className={[this.state.loaded,'image'].join(' ')} onClick = {()=>this.G('history').push("/page/"+image.parent)} ref={(container)=>this.container = container}>
				<div className='iback group'>
					<div className='spacer' style={{height:0,marginTop:100/image.ratio+'%'}}></div>
				</div>
			</div>
		)
		*/
		image.info = image.title||''
		if(image.description) image.info +=' | '+image.description;
		if(this.G('state').Context === 'front'){
			return(
				<div className={[this.state.loaded,'image'].join(' ')} onClick = {()=>this.G('history').push("/page/"+image.parent)} ref={(container)=>this.container = container}>
					<div className='iback group'>
						<div className='spacer' style={{height:0,marginTop:100/image.ratio+'%'}}></div>
					</div>
					{this.state.loaded === 'loading' && this.state.vis && (
						<div className = 'spinner'>
							<FontAwesome name = 'cog' spin size = '2x' style = {{display:this.state.vis?'inline':'none'}} />
						</div>
					)}
					{this.state.loaded === 'error' && this.state.vis && (
						<div className = 'spinner'>
							<FontAwesome name = 'exclamation-triangle' size = '2x' style = {{display:this.state.vis?'inline':'none'}}/>
						</div>
					)}
					<div className={['ifront',this.state.vis?'visible':'hidden'].join(' ')} ref={(ifront)=>this.ifront = ifront}>
						{this.state.loaded === 'loading' && this.state.load && <img alt = '' onLoad = {()=>this.G('imonload')(this,true)} onError = {()=>this.G('imonerror')(this)} src = {image.src} style = {{display:"none"}} ref = {(image)=>this.image=image} />}
						{this.state.loaded!=='error' && <canvas ref={(canvas)=>this.canvas=canvas}/>}
					</div>
					{image.info && <div className = 'ttParent info' style = {{display:this.state.vis?'block':'none'}}>
						<Tooltip message = {tools.decode(image.info).substring(0,200)+'...'} position = 'bottom' />
					</div>}

					{/*image.favicon && <div className='favicon ttParent' style = {{display:this.state.vis?'flex':'none'}}>
						<a href={'http://'+tools.sitename(image.parenturl)} target = '_blank' onClick = {(event)=>event.stopPropagation()} >
							<img src={image.favicon} alt = 'favicon' ref={(favicon)=>this.favicon=favicon} onLoad = {this.faviload} style = {{display:this.state.fav?'block':'none',visibility:this.state.vis?'visible':'hidden'}}  />
						</a>
						<Tooltip message = {tools.sitename(image.parenturl)} position = 'top' />
					</div>*/}
				</div>
			)
		}else{
			return(
				<div className={[this.state.loaded,'image',image.class].join(' ')} data-top = {this.props.scroll} onClick = {()=>{this.G('slideshow')(this.index)}}  ref={(container)=>this.container = container}>
					<div className='iback group'>
						<div className='spacer' style={{height:0,marginTop:100/image.ratio+'%'}}></div>
					</div>
					{this.state.loaded === 'loading' && this.state.vis && (
						<div className = 'spinner'>
							<FontAwesome name = 'cog' spin size = '2x' style = {{display:this.state.vis?'inline':'none'}} />
						</div>
					)}
					{this.state.loaded === 'error' && this.state.vis && (
						<div className = 'spinner'>
							<FontAwesome name = 'exclamation-triangle' size = '2x' style = {{display:this.state.vis?'inline':'none'}}/>
						</div>
					)}

					<div className={['ifront',this.state.vis?'visible':'hidden'].join(' ')} ref={(ifront)=>this.ifront = ifront} >
						{this.state.loaded === 'loading' && this.state.load && <img alt = '' onLoad = {()=>this.G('imonload')(this,true)} onError = {()=>this.G('imonerror')(this)} src = {image.src} style = {{display:"none"}} ref = {(image)=>this.image=image} />}
						{this.state.loaded!=='error' && <canvas ref={(canvas)=>this.canvas=canvas}/>}
					</div>

					{image.alt && <div className = 'ttParent info' style = {{display:this.state.vis?'block':'none'}}>
						<Tooltip message = {tools.decode(image.alt)} position = 'bottom' />
					</div>}

					{this.state.loaded !== 'loading' && <div className  = 'controls' style = {{display:this.state.vis?'block':'none'}}>
						{image.src.indexOf('data:')!==0 && <div className='control ttParent' onClick={(event)=>{this.reverse(event,image.src)}} >
							<FontAwesome name='google' />
							<Tooltip message = 'Reverse image lookup' position='top' />
						</div>}

						{image.url && image.urltitle && <div className='control ttParent'  onClick={(event)=>{event.stopPropagation()}}>
							<a href={image.url} target='_blank'><FontAwesome name='external-link' /></a>
							<Tooltip message = {'Visit page at: '+image.urltitle} position='top' />
						</div>}

						{!this.state.front && !image.deleted && (this.G('state').loggedin||image.temp) && (
							<div className='control ttParent' onClick={(event)=>{this.G('toFront')(event,this.index)}}  >
								<FontAwesome name='thumb-tack ' />
								<Tooltip message = 'Set as Front Image'  position='top' />
							</div>
						)}
						<div className='control ttParent' >
							<a href={image.src} download target='_blank'><FontAwesome name='download' /></a>
							<Tooltip message = 'Download Image' position='top' />
						</div>
						{(this.G('state').loggedin||image.temp) && (
							<div className='control ttParent' onClick={(event)=>{this.G('deleteSingle')(event,this.index,this)}} >
								<FontAwesome name={image.deleted?'check':'times'} />
								<Tooltip message = {image.deleted?'Restore Image':'Delete Image'} position='top' />
							</div>
						)}
					</div>}

				</div>
			)
		}
	}
}
