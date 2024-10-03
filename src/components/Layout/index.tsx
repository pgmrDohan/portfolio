import { Outlet } from "react-router-dom";
import { Footer } from "../Footer";
import { Header } from "../Header"

export const Layout = () => {
	return (
		<>
			<Header className="mt-20" />
			<div className="mt-50">
				<Outlet />
			</div>
			<Footer className="mt-40 mb-40" drawDuration={5}
				maintainDuration={1}
				fadeDuration={1}
				delay={3} />
		</>
	)
}