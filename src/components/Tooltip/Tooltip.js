import React, { Component } from 'react';
import './Tooltip.css';

export class Tooltip extends Component {
	render(){
		return(
			<div className = {['tooltip ',this.props.position].join('')} >
				{this.props.message}
			</div>
		)
	}
}
