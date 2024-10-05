import { Outlet } from "react-router-dom";
import { Footer } from "../Footer";
import { Header } from "../Header"
import styles from './index.module.scss'

export const Layout = () => {
	return (
		<>
			<Header className={styles.Header} />
			<div className={styles.Content}>
				<Outlet />
			</div>
			<Footer className={styles.Footer} drawDuration={5}
				maintainDuration={1}
				fadeDuration={1}
				delay={3} />
		</>
	)
}