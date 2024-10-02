import styles from './index.module.scss';
import { icons, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react'

type Props = {
	size: number,
	icon: string
}

export const IconButton = ({ size, icon }: Props) => {
	const Icon = (icons as { [key: string]: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> })[icon];
	return (
		<div className={styles.IconButton} style={{
			width: `${size}px`,
			height: `${size}px`,
		}}>
			<Icon className={styles.Icon} size={size / 2} strokeWidth={2}></Icon>
		</div >
	)
}