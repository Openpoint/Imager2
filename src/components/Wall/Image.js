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

		this.state = {
			vis:false,
			loaded:'loading',
			src:"/blank.png",
			alt:"",
			front:this.props.image.front,
			loggedin:this.G('state').loggedin,
		};
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

	componentDidMount(){
		this.props.putim(this.props.image.index,this);

	}
	componentWillUnmount(){
		clearTimeout(this.to);
		window.removeEventListener('scroll',this.lazyload);
	}
	componentWillReceiveProps(nextProps){
		console.warn(nextProps)
		this.setState({
			front:nextProps.image.front,
			loggedin:this.G('state').loggedin
		})
	}


	shouldComponentUpdate(nextProps, nextState){
		return (nextState.loaded!==this.state.loaded || this.G('state').loggedin!==this.state.loggedin || nextState.front!==this.state.front || nextState.vis!==this.state.vis)
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
					{this.state.loaded === 'loading' && this.state.vis && <FontAwesome name = 'cog' size = '2x' spin style = {{display:this.state.vis?'inline':'none'}} />}
					{this.state.loaded === 'error' && this.state.vis && <FontAwesome name = 'exclamation-triangle' size = '2x' style = {{display:this.state.vis?'inline':'none'}}/>}
					<div className={['ifront',this.state.vis?'visible':'hidden'].join(' ')} ref={(ifront)=>this.ifront = ifront}>
						<img src = '/blank.png' alt = {this.props.image.alt} ref = {(image)=>this.image = image} style = {{visibility:this.state.vis?'visible':'hidden'}} />
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
				<div className={[this.state.loaded,'image',image.class].join(' ')} data-top = {this.props.scroll} onClick = {()=>{this.G('slideshow')(this.props.index)}}  ref={(container)=>this.container = container}>
					<div className='iback group'>
						<div className='spacer' style={{height:0,marginTop:100/image.ratio+'%'}}></div>
					</div>
					{this.state.loaded === 'loading' && this.state.vis && <FontAwesome name = 'cog' size = '2x' spin style = {{display:this.state.vis?'inline':'none'}} />}
					{this.state.loaded === 'error' && this.state.vis && <FontAwesome name = 'exclamation-triangle' size = '2x' style = {{display:this.state.vis?'inline':'none'}} />}

					<div className={['ifront',this.state.vis?'visible':'hidden'].join(' ')} ref={(ifront)=>this.ifront = ifront} >
						<img src = '/blank.png' alt = {this.props.image.alt} ref = {(image)=>this.image = image} style = {{visibility:this.state.vis?'visible':'hidden'}} />
					</div>

					{image.alt && <div className = 'ttParent info' style = {{display:this.state.vis?'block':'none'}}>
						<Tooltip message = {tools.decode(image.alt)} position = 'bottom' />
					</div>}

					<div className  = 'controls' style = {{display:this.state.vis?'block':'none'}}>
						{image.src.indexOf('data:')!==0 && <div className='control ttParent' onClick={(event)=>{this.reverse(event,image.src)}} >
							<FontAwesome name='google' />
							<Tooltip message = 'Reverse image lookup' position='top' />
						</div>}

						{image.url && image.urltitle && <div className='control ttParent'  onClick={(event)=>{event.stopPropagation()}}>
							<a href={image.url} target='_blank'><FontAwesome name='external-link' /></a>
							<Tooltip message = {'Visit page at: '+image.urltitle} position='top' />
						</div>}

						{!this.state.front && !image.deleted && (this.state.loggedin||image.temp) && (
							<div className='control ttParent' onClick={(event)=>{this.G('toFront')(event,this.props.index)}}  >
								<FontAwesome name='thumb-tack ' />
								<Tooltip message = 'Set as Front Image'  position='top' />
							</div>
						)}
						<div className='control ttParent' >
							<a href={image.src} download target='_blank'><FontAwesome name='download' /></a>
							<Tooltip message = 'Download Image' position='top' />
						</div>
						{(this.state.loggedin||image.temp) && (
							<div className='control ttParent' onClick={(event)=>{this.G('deleteSingle')(event,this.props.index,this)}} >
								<FontAwesome name={image.deleted?'check':'times'} />
								<Tooltip message = {image.deleted?'Restore Image':'Delete Image'} position='top' />
							</div>
						)}
					</div>

				</div>
			)
		}
	}
}
