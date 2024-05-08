import React from 'react';
import './App.scss';
import Header from './components/Header';
import { Triangle } from './components/Shapes';

function App() {
	return (
		<div className="App">
			<Header />
			<Triangle size={200} color="#3894FF" style={{ position: "absolute", top: "230px", rotate: "8.71deg", left: "570px", zIndex: "-10" }} />
		</div>
	);
}

export default App;