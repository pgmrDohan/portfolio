import React from 'react';
import './styles.scss';

export default function Circle(props: { size: number, color: string }) {
	return (
		<div className='layered'>
			<div className="Circle" style={{ width: `${props.size}px`, height: `${props.size}px`, backgroundColor: props.color }}></div>
			<div className="Circle blur" style={{ width: `${props.size}px`, height: `${props.size}px`, backgroundColor: props.color }}></div>
		</div>
	)
}