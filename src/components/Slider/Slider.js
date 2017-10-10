import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import './Slider.css';

export class Slider extends Component {
	constructor(props){
		super(props);
		this.slide = this.slide.bind(this);
		this.state = {index:props.states.Wall.index}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.states.Wall.slideshow){
			this.setState({
				index:nextProps.states.Wall.index
			})
		}
	}

	slide(dir){
		var i;
		var images = this.props.states.Wall.images;
		var len = images.length-1;
		(dir === 'r')?i=this.state.index+1:i=this.state.index-1;
		if(i<0) i = len;
		if(i>len) i=0;

		this.setState({
			index:i
		})
	}
	render(){

		var image = typeof this.state.index!== 'undefined'?this.props.states.Wall.images[this.state.index]:false;
		if(typeof image === 'undefined') image = false;
		var functions = this.props.functions;
		return(
			<div id='slideshow' className={this.props.states.Wall.slideshow?'open':'closed'}>
				<div className='control close'>
					<FontAwesome name='times' size='2x' onClick={()=>{functions.Wall.slideshow(false)}} />
				</div>
				<FontAwesome name='chevron-left' size='2x' className='control left' onClick={()=>{this.slide('l')}}/>
				{image && <img src={image.src} alt={image.alt} width={image.width} height={image.height} />	}
				<FontAwesome name='chevron-right' size='2x' className='control right' onClick={()=>{this.slide('r')}} />
				{image.alt && <div className='alt'>{image.alt}</div>}
			</div>
		)
	}
}
