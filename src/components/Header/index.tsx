import logo from '../../assets/logo.png';
import { MdEmail } from "react-icons/md";
import { VscGithubInverted } from "react-icons/vsc";
import { BsInstagram } from "react-icons/bs";
import silinder from '../../assets/silinder.svg';
import './styles.scss';

export default function Header() {
	return (
		<div className="Header">
			<img src={silinder} alt="" className='silinder' />
			<div id='silinderBgBlur'></div>
			<div className='content'>
				<img id='logo' src={logo} alt="" />
				<div className='sns'>
					<MdEmail style={{ color: "white" }} />
					<VscGithubInverted style={{ color: "white" }} />
					<BsInstagram style={{ color: "white" }} />
				</div>
			</div >
		</div >
	);
}