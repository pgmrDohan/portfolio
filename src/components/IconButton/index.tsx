import { useIcon } from '@/hooks';
import styles from './index.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement> & {
	size: number,
	icon: string
}

export const IconButton = ({ size, icon, ...rest }: Props) => {
	const Icon = useIcon(icon);
	return (
		<div {...rest} className={styles.IconButton} style={{
			width: `${size}px`,
			height: `${size}px`,
		}}>
			<Icon className={styles.Icon} size={size / 2} strokeWidth={2}></Icon>
		</div >
	)
}