import { DetailedHTMLProps, HTMLAttributes, HTMLProps } from "react";
import { IconButton } from "../IconButton"
import styles from './index.module.scss';
import { useDarkMode } from '@/hooks';

export const Header: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	const { toggleTheme, isDarkMode } = useDarkMode();

	return (
		<div className={[styles.Header, className].filter(Boolean).join(' ')}>
			<div className={styles.flexGap5}>
				<IconButton size={40} icon="House"></IconButton>
				<IconButton size={40} icon="BookText"></IconButton>
			</div>
			<div className={styles.flexGap5}>
				<IconButton onClick={toggleTheme} size={40} icon={isDarkMode?"Sun":"Moon"}></IconButton>
				<IconButton size={40} icon="Command"></IconButton>
			</div>
		</div >
	)
}