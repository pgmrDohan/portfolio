import React from 'react';
import './App.scss';
import Header from './components/Header';
import { Triangle, Circle } from './components/Shapes';
import Tag from './components/Tag';

function App() {
	return (
		<div className="App">
			<Header mail='me@dohan.in' github='pgmrdohan' insta='i70h4n' />
			{/* <Triangle size={150} color="#3894FF" style={{ rotate: "8.71deg", zIndex: "-10" }} /> */}
			<Tag content="Portfolio" style={{ rotate: "10.62deg", zIndex: "-10", right: "180px", bottom: "500px" }} />
			<Tag content="LowLevel" style={{ rotate: "-8.58deg", zIndex: "-10", bottom: "300px", left: "80px" }} />
			{/* <Circle size={100} color="#38FF70" style={{ position: "absolute", left: "1010px", top: "500px", zIndex: "-10" }} /> */}
			<Tag content="TechBlog" style={{ rotate: "8.48deg", zIndex: "-10", right: "6px", bottom: "250px" }} />
			{/* <Circle size={100} color="#FFF738" style={{ position: "absolute", left: "270px", top: "740px" }} /> */}
			<Tag content="UI/UX" style={{ rotate: "-16.67deg", zIndex: "-11", left: "1px", bottom: "150px" }} />
			<Tag content="Web Fullstack" style={{ rotate: "21.06deg", zIndex: "-11", right: "1px", bottom: "120px" }} />
			{/* <Circle size={100} color="#FF3838" style={{ position: "absolute", left: "770px", top: "790px" }} /> */}
			<Tag content="Dohan Kwon" style={{ zIndex: "-12", bottom: "50px", left: "15%" }} />
		</div>
	);
}

export default App;