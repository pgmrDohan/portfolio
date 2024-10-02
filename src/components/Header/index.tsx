import { IconButton } from "../IconButton"
import styles from './index.module.scss';

export const Header = () => {
	<div className={styles.Header}>
		<div className>
			<IconButton size={50} icon="House"></IconButton>
			<IconButton size={50} icon="BookText"></IconButton>
		</div>
		<IconButton size={50} icon="Moon"></IconButton>
		<IconButton size={50} icon="Command"></IconButton>
	</div >

}