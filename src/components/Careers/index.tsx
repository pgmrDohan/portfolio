import { ArrowRight } from 'lucide-react';
import styles from './index.module.scss'

type Props = {
	info: { [key: string]: { startYear?: number, endYear?: number, desc: string, now?: boolean } }
};

export const Careers = ({ info }: Props) => {
	return (
		<ul className={styles.Careers}>
			{Object.entries(info).map(([key, { startYear, endYear = '', desc, now }], i) => {
				return (
					<li key={i} className={styles.listElement}>
						<div className={styles.year}>
							{now ? <div className={styles.pulseCircle}></div> : null}
							{now ? "현재" : `${startYear} - ${endYear}`}
						</div>
						<span>{key}</span>
						<p>{desc}</p>
					</li>
				);
			})}
			<li className={styles.moreIcon}>
				<ArrowRight size={15} strokeWidth={2} className={`${styles.moreIcon} mr-5`} />
				경력 더보기
			</li>
		</ul >
	)
}