import React from 'react';
import logo from './assets/logo.png';
import { MdEmail } from "react-icons/md";
import { VscGithubInverted } from "react-icons/vsc";
import { BsInstagram } from "react-icons/bs";
import background from './assets/background.svg';
import silinder from './assets/silinder.svg';
import './App.css';

function App() {
	return (
		<div className="App">
			<center>
				<img src={silinder} alt="" style={{ position: "relative", bottom: "15px" }} />
				{/* <div className='silinder'>
					<div style={{ width: "750px", height: "300px", background: "linear-gradient(97deg, rgba(255, 255, 255, 0.40) 13.62%, rgba(255, 255, 255, 0.20) 38.53%, rgba(255, 255, 255, 0.10) 74.05%)" }}></div>
					<div style={{ width: "780px", height: "30px", clipPath: "polygon(15px 0px, calc(100% - 15px) 0px, 100% 100%, 0px 100%)", background: "linear-gradient(44deg, rgba(255, 255, 255, 0.4) 13.62%, rgba(255, 255, 255, 0.2) 38.53%, rgba(255, 255, 255, 0.1) 74.05%)" }}></div>
					<div style={{ width: "fit-content", height: "30px", overflow: "hidden", rotate: "180deg" }}>
						<div style={{ background: "linear-gradient(280deg, rgba(255, 255, 255, 0.4) 15.83%, rgba(255, 255, 255, 0.2) 40.41%, rgba(255, 255, 255, 0.1) 77.51%)", width: "780px", height: "60px", borderRadius: "50%" }}></div>
					</div>
				</div> */}
				<img src={logo} style={{ position: "absolute", left: "880px", top: "60px" }} alt="" />
				<MdEmail size={30} style={{ color: "white", position: "absolute", left: "855px", top: "250px" }} />
				<VscGithubInverted size={25} style={{ color: "white", position: "absolute", left: "940px", top: "251px" }} />
				<BsInstagram size={23} style={{ color: "white", position: "absolute", left: "1020px", top: "252px" }} />
			</center>
			<img src={background} width="100%" alt="" style={{ position: "absolute" }} />
			<div style={{ position: "absolute", zIndex: "-10", bottom: "750px", left: "600px", transform: "rotate(8.71deg)", boxShadow: "-4px -4px 20px 0px rgba(0, 0, 0, 0.25) inset, 4px 4px 20px 0px rgba(255, 255, 255, 0.25) inset" }}>
				<div style={{ position: "absolute", width: 0, height: 0, borderLeft: "75px solid transparent", borderRight: "75px solid transparent", borderBottom: "130px solid #3894FF" }}></div>
				<div style={{ position: "absolute", width: 0, height: 0, borderLeft: "75px solid transparent", borderRight: "75px solid transparent", borderBottom: "130px solid #3894FF", filter: "blur(25px)" }}></div>
			</div>
		</div>
	);
}

export default App;