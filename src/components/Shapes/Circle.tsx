import React from 'react';
import './styles.scss';

export default function Circle(props: { size: number, color: string, style?: React.CSSProperties }) {
	return (
		<div className='layered' style={props.style}>
			<div className="Circle" style={{ width: `${props.size}px`, height: `${props.size}px`, backgroundColor: props.color }}></div>
			<div className="Circle blur" style={{ width: `${props.size}px`, height: `${props.size}px`, backgroundColor: props.color }}></div>
		</div>
	)
}