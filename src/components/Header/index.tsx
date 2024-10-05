import { DetailedHTMLProps, HTMLAttributes, HTMLProps } from "react";
import { IconButton } from "../IconButton"
import styles from './index.module.scss';

export const Header: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	return (
		<div className={[styles.Header, className].filter(Boolean).join(' ')}>
			<div className={styles.flexGap5}>
				<IconButton size={40} icon="House"></IconButton>
				<IconButton size={40} icon="BookText"></IconButton>
			</div>
			<div className={styles.flexGap5}>
				<IconButton size={40} icon="Moon"></IconButton>
				<IconButton size={40} icon="Command"></IconButton>
			</div>
		</div >
	)
}