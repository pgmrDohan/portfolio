import { Outlet } from "react-router-dom";
import { Footer } from "../Footer";
import { Header } from "../Header"
import styles from './index.module.scss'
import { useLocation } from 'react-router-dom';

export const Layout = () => {
	const location = useLocation();

	return (
		<div className={styles.Root}>
			<Header className={styles.Header} />
			<div className={styles.Content}>
				<Outlet />
			</div>
			<Footer className={styles.Footer} drawDuration={5}
				maintainDuration={1}
				fadeDuration={1}
				delay={3} />
		</div>
	)
}