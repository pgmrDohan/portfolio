import styles from './index.module.scss';
import { useDarkMode } from '@/hooks';

export function Home() {
	const { toggleTheme } = useDarkMode();

	return (
		<><button onClick={toggleTheme}>test</button></>
	)
};