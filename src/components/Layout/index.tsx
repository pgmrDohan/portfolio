import { Outlet } from "react-router-dom";
import { Header } from "../Header"
import styles from './index.module.scss';

export const Layout = () => {
	return (
		<>
			<Header className={styles.Header} />
			<div className={styles.container}>
				<Outlet />
			</div>
		</>
	)
}