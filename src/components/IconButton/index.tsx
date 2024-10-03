import { useIcon } from '@/hooks';
import styles from './index.module.scss';

type Props = {
	size: number,
	icon: string
}

export const IconButton = ({ size, icon }: Props) => {
	const Icon = useIcon(icon);
	return (
		<div className={styles.IconButton} style={{
			width: `${size}px`,
			height: `${size}px`,
		}}>
			<Icon className={styles.Icon} size={size / 2} strokeWidth={2}></Icon>
		</div >
	)
}