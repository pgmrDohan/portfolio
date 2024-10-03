import styles from './index.module.scss';
import { MyInfo } from '@/components';
import profileImage from '@/assets/images/profileImage.png';

export function Home() {
	return (
		<div className="Home">
			<MyInfo profileImage={profileImage} name="권도한" pronounce='/kwʌn·do·ɑn/' />
		</div >
	);
};