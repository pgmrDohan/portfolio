import React from 'react';
import './styles.scss';

export default function Triangle(props: { size: number, color: string, className?: string, style?: React.CSSProperties }) {
	return (
		<div className={`layered ${props.className}`} style={props.style}>
			<svg width={`${props.size}px`} height={`${props.size}px`} viewBox="0 0 176 152" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g filter="url(#filter0_ii_214_209)">
					<path d="M88 0.128479L175.469 151.628H0.531433L88 0.128479Z" fill={props.color} />
				</g>
				<defs>
					<filter id="filter0_ii_214_209" x="-3.46857" y="-3.87152" width="182.937" height="159.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset dx="4" dy="4" />
						<feGaussianBlur stdDeviation="10" />
						<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
						<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
						<feBlend mode="normal" in2="shape" result="effect1_innerShadow_214_209" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset dx="-4" dy="-4" />
						<feGaussianBlur stdDeviation="10" />
						<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
						<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
						<feBlend mode="normal" in2="effect1_innerShadow_214_209" result="effect2_innerShadow_214_209" />
					</filter>
				</defs>
			</svg>
			<svg className='blur' width={`${props.size}px`} height={`${props.size}px`} viewBox="0 0 176 152" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g filter="url(#filter0_ii_214_209)">
					<path d="M88 0.128479L175.469 151.628H0.531433L88 0.128479Z" fill={props.color} />
				</g>
				<defs>
					<filter id="filter0_ii_214_209" x="-3.46857" y="-3.87152" width="182.937" height="159.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
						<feFlood flood-opacity="0" result="BackgroundImageFix" />
						<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset dx="4" dy="4" />
						<feGaussianBlur stdDeviation="10" />
						<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
						<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
						<feBlend mode="normal" in2="shape" result="effect1_innerShadow_214_209" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset dx="-4" dy="-4" />
						<feGaussianBlur stdDeviation="10" />
						<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
						<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
						<feBlend mode="normal" in2="effect1_innerShadow_214_209" result="effect2_innerShadow_214_209" />
					</filter>
				</defs>
			</svg>
		</div>
	)
}