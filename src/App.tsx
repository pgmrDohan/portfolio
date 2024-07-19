import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import './App.scss';
import Header from './components/Header';
import { Triangle, Circle } from './components/Shapes';
import Tag from './components/Tag';

function App() {
	const [width, setWidth] = useState(document.documentElement.clientWidth);

	const redirectCleanpage = useMemo(() => {
		if (width < 335) {
			//window.location.href = "small than mobile"
		}
	}, [width]);

	const handleResize = () => {
		setWidth(document.documentElement.clientWidth);
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className="App">
			<Header mail='me@dohan.in' github='pgmrdohan' insta='i70h4n' />
			{/* <Triangle size={150} color="#3894FF" style={{ rotate: "8.71deg", zIndex: "-10" }} /> */}
			{/* <Tag content="Portfolio" style={{}} /> */}
			{/* <Tag content="LowLevel" style={{}} /> */}
			{/* <Circle size={100} color="#38FF70" style={{ position: "absolute", left: "1010px", top: "500px", zIndex: "-10" }} /> */}
			{/* <Tag content="TechBlog" style={{}} /> */}
			{/* <Circle size={100} color="#FFF738" style={{ position: "absolute", left: "270px", top: "740px" }} /> */}
			{/* <Tag content="UI/UX" style={{}} /> */}
			{/* <Tag content="Web Fullstack" style={{}} /> */}
			{/* <Circle size={100} color="#FF3838" style={{ position: "absolute", left: "770px", top: "790px" }} /> */}
			{/* <Tag content="Dohan Kwon" style={{}} /> */}
		</div>
	);
}

export default App;