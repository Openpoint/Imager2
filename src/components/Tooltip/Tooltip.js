import React, { Component } from 'react';
import './Tooltip.css';

export class Tooltip extends Component {
	render(){
		var width = null;
		if(this.props.width) width = this.props.width*1;
		return(
			<div className = {['tooltip ',this.props.position].join('')}>
				<div className='arrow'></div>
				<div className = 'text' style = {{width:width}} dangerouslySetInnerHTML={{__html:this.props.message}} />
			</div>
		)
	}
}
