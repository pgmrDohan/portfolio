import React from 'react';
import './App.scss';
import Header from './components/Header';
import { Triangle, Circle } from './components/Shapes';
import Tag from './components/Tag';

function App() {
	return (
		<div className="App">
			<Header />
			<Triangle size={200} color="#3894FF" style={{ position: "absolute", top: "230px", rotate: "8.71deg", left: "570px", zIndex: "-10" }} />
			<Tag content="Portfolio" style={{ position: "absolute", left: "800px", rotate: "10.62deg", top: "280px", zIndex: "-10" }} />
			<Tag content="LowLevel" style={{ position: "absolute", left: "430px", rotate: "-8.58deg", top: "520px", zIndex: "-10" }} />
			<Circle size={100} color="#38FF70" style={{ position: "absolute", left: "1010px", top: "500px", zIndex: "-10" }} />
			<Tag content="TechBlog" style={{ position: "absolute", left: "1080px", rotate: "8.48deg", top: "620px", zIndex: "-10" }} />
			<Circle size={100} color="#FFF738" style={{ position: "absolute", left: "270px", top: "740px" }} />
			<Tag content="UI/UX" style={{ position: "absolute", left: "290px", rotate: "-16.67deg", top: "730px", zIndex: "-11" }} />
			<Tag content="Web Fullstack" style={{ position: "absolute", left: "800px", rotate: "21.06deg", top: "760px", zIndex: "-11" }} />
			<Circle size={100} color="#FF3838" style={{ position: "absolute", left: "750px", top: "770px" }} />
			<Tag content="Dohan Kwon" style={{ position: "absolute", top: "870px", left: "470px", zIndex: "-12" }} />
		</div>
	);
}

export default App;