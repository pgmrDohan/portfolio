import React from 'react';
import logo from './assets/logo.png';
import { MdEmail } from "react-icons/md";
import { VscGithubInverted } from "react-icons/vsc";
import { BsInstagram } from "react-icons/bs";
import silinder from './assets/silinder.svg';
import './App.css';

function App() {
	return (
		<div className="App">
			<center>

				<img src={silinder} alt="" style={{ position: "relative", bottom: "15px" }} />
				<div style={{ width: "880px", height: "74.4px", borderRadius: "50%", backdropFilter: "blur(10px)", position: "relative", bottom: "122px", zIndex: "-1" }}></div>

				<img src={logo} style={{ position: "absolute", left: "880px", top: "60px" }} alt="" />
				<MdEmail size={30} style={{ color: "white", position: "absolute", left: "855px", top: "250px" }} />
				<VscGithubInverted size={25} style={{ color: "white", position: "absolute", left: "940px", top: "251px" }} />
				<BsInstagram size={23} style={{ color: "white", position: "absolute", left: "1020px", top: "252px" }} />
			</center>
			<div style={{ position: "absolute", zIndex: "-10", bottom: "760px", left: "700px", transform: "rotate(8.71deg)", boxShadow: "-4px -4px 20px 0px rgba(0, 0, 0, 0.25) inset, 4px 4px 20px 0px rgba(255, 255, 255, 0.25) inset" }}>
				<div style={{ position: "absolute", width: 0, height: 0, borderLeft: "75px solid transparent", borderRight: "75px solid transparent", borderBottom: "130px solid #3894FF" }}></div>
				<div style={{ position: "absolute", width: 0, height: 0, borderLeft: "75px solid transparent", borderRight: "75px solid transparent", borderBottom: "130px solid #3894FF", filter: "blur(25px)" }}></div>
			</div>
		</div>
	);
}

export default App;