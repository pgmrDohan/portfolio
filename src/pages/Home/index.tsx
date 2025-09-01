import styles from './index.module.scss';
import { useDarkMode } from '@/hooks';
import { PersonalInfo } from '@/components';

export function Home() {
	const { toggleTheme } = useDarkMode();

	return (
		<>
			<PersonalInfo profileImage="profileImage.png" name="권도한" pronounce='/kwʌn·do·ɑn/' />
		</>
	)
};