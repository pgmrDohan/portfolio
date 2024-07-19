import React from 'react';
import logo from '../../assets/logo.png';
import { MdEmail } from "react-icons/md";
import { VscGithubInverted } from "react-icons/vsc";
import { BsInstagram } from "react-icons/bs";
import silinder from '../../assets/silinder.svg';
import './styles.scss';

export interface Props {
	mail: string,
	github: string,
	insta: string
}

export default function Header(props: Props) {
	return (
		<div className="Header">
			<img src={silinder} alt="" className='silinder' />
			<div id='silinderBgBlur'></div>
			<div className='content'>
				<img id='logo' src={logo} alt="" />
				<div className='sns'>
					<MdEmail style={{ color: "white" }} onClick={() => window.open("mailto:" + props.mail)} />
					<VscGithubInverted style={{ color: "white" }} onClick={() => window.open("https://github.com/" + props.github)} />
					<BsInstagram style={{ color: "white" }} onClick={() => window.open("https://instagram.com/" + props.insta)} />
				</div>
			</div >
		</div >
	);
}