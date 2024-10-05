import { Outlet } from "react-router-dom";
import { Footer } from "../Footer";
import { Header } from "../Header"
import styles from './index.module.scss'
import { MainEmbedImage } from "@/assets";
import { useEffect, useState } from "react";
import { Head } from "vite-react-ssg";

export const Layout = () => {
	const [location, setLocation] = useState<{ pathname: string, href: string }>({ pathname: "", href: "" });

	useEffect(() => {
		setLocation({
			pathname: window.location.pathname,
			href: window.location.href
		});
	}, [])

	return (
		<>
			<Head>
				<title>Dohan Kwon - {location.pathname === '/' ? "Portfolio" : location.pathname}</title>
				<meta name="title" content={`Dohan Kwon - ${location.pathname === '/' ? "Portfolio" : location.pathname}`} />
				<meta name="description" content={"I'm Dohan Kwon, a developer who connects people to people and people to things. I started developing software in Korea in 2020 and has been growing my tech stack and developing various services. Currently, I works as an individual freelance developer in various fields."} />
				<meta property="og:url" content={location.href} />
				<meta property="og:title" content={`Dohan Kwon - ${location.pathname === '/' ? "Portfolio" : location.pathname}`} />
				<meta property="og:description" content={"I'm Dohan Kwon, a developer who connects people to people and people to things. I started developing software in Korea in 2020 and has been growing my tech stack and developing various services. Currently, I works as an individual freelance developer in various fields."} />
				<meta property="og:image" content={location.pathname === '/' ? MainEmbedImage : ""} />
				<meta property="twitter:url" content={location.href} />
				<meta property="twitter:title" content={`Dohan Kwon - ${location.pathname === '/' ? "Portfolio" : location.pathname}`} />
				<meta property="twitter:description" content={"I'm Dohan Kwon, a developer who connects people to people and people to things. I started developing software in Korea in 2020 and has been growing my tech stack and developing various services. Currently, I works as an individual freelance developer in various fields."} />
				<meta property="twitter:image" content={location.pathname === '/' ? MainEmbedImage : ""} />
			</Head>
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