import { ArrowRight } from 'lucide-react';
import styles from './index.module.scss'

type Props = {
	info: { [key: string]: { year: number, hosted: string } }
};

export const Experiences = ({ info }: Props) => {
	return (
		<ul className={styles.Experiences}>
			{Object.entries(info).map(([key, { year, hosted }], i) => {
				return (
					<li key={i} className={styles.listElement}>
						<p className={styles.year}>{year}</p>
						<span>{key}</span>
						<p>{hosted}</p>
					</li>
				);
			})}
			<li className={styles.moreIcon}>
				<ArrowRight size={15} strokeWidth={2} className={`${styles.moreIcon} mr-5`} />
				대외 활동 더보기
			</li>
		</ul>
	)
}