import logo from '../assets/logo.png';
import { MdEmail } from "react-icons/md";
import { VscGithubInverted } from "react-icons/vsc";
import { BsInstagram } from "react-icons/bs";
import silinder from '../assets/silinder.svg';

export default function Header() {
	return (
		<div className="Header">
			<center>
				<img src={silinder} alt="" style={{ position: "relative", bottom: "15px" }} />
				<div style={{ width: "880px", height: "74.4px", borderRadius: "50%", backdropFilter: "blur(10px)", position: "relative", bottom: "122px", zIndex: "-1" }}></div>
				<img src={logo} style={{ position: "absolute", left: "880px", top: "60px" }} alt="" />
				<MdEmail size={30} style={{ color: "white", position: "absolute", left: "855px", top: "250px" }} />
				<VscGithubInverted size={25} style={{ color: "white", position: "absolute", left: "940px", top: "251px" }} />
				<BsInstagram size={23} style={{ color: "white", position: "absolute", left: "1020px", top: "252px" }} />
			</center>
		</div>
	);
}