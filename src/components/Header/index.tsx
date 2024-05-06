import logo from '../../assets/logo.png';
import { MdEmail } from "react-icons/md";
import { VscGithubInverted } from "react-icons/vsc";
import { BsInstagram } from "react-icons/bs";
import silinder from '../../assets/silinder.svg';
import './styles.scss';

export default function Header() {
	return (
		<div className="Header">
			<center>
				<img src={silinder} alt="" className='silinder' />
				<div id='silinderBgBlur'></div>
				<div className='content'>
					<img src={logo} alt="" />
					<div className='sns'>
						<MdEmail size={30} style={{ color: "white" }} />
						<VscGithubInverted size={25} style={{ color: "white" }} />
						<BsInstagram size={23} style={{ color: "white" }} />
					</div>
				</div >
			</center>
		</div >
	);
}