import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import './Slider.css';

export class Slider extends Component {
	constructor(props){
		super(props);
		this.G = this.props.Global;
		this.slideshow = this.slideshow.bind(this);
		this.G('slideshow',this.slideshow);

		this.slide = this.slide.bind(this);
		this.state = {
			slideshow:false,
			index:false
		};
	}

	slideshow(index){
		if(this.state.slideshow){
			this.setState({
				slideshow:false,
				index:false
			})
			return;
		}else{
			this.images = this.G('page').images;
			this.setState({
				slideshow:true,
				index:index
			})
		}
	}
	slide(dir){
		var i;
		var images = this.images;
		var len = images.length-1;
		(dir === 'r')?i=this.state.index+1:i=this.state.index-1;
		if(i<0) i = len;
		if(i>len) i=0;
		this.setState({
			index:i
		})
	}
	componentDidUpdate(prevProps, prevState){
		if(this.im){
			this.im.onerror = ()=>{
				if(this.im.src.indexOf('http') === 0 && this.im.src.indexOf('?') !== -1) this.im.src=this.im.src.split('?')[0];
			}
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		return(nextState.slideshow!==this.state.slideshow||(this.state.slideshow && nextState.index!==this.state.index))
	}
	render(){
		var image = false
		if(typeof this.state.index === 'number') image = this.images[this.state.index]
		return(
			<div id='slideshow' className={this.state.slideshow?'open':'closed'}>
				<div className='control close'>
					<FontAwesome name='times' size='2x' onClick={()=>{this.slideshow(false)}} />
				</div>
				<FontAwesome name='chevron-left' size='2x' className='control left' onClick={()=>{this.slide('l')}}/>
				{this.state.slideshow && typeof this.state.index === 'number' && <img src={image.src} alt={image.alt} width={image.width} height={image.height} ref = {(im)=>this.im = im} />	}
				<FontAwesome name='chevron-right' size='2x' className='control right' onClick={()=>{this.slide('r')}} />
				{image.alt && <div className='alt'>{image.alt}</div>}
			</div>
		)
	}
}
