import { ArrowRight, ArrowUpRight } from 'lucide-react';
import styles from './index.module.scss';

type Props = {
	mode: "Compact" | "List"
	info: [{ coverImage: string, bookName: string, author: string, link: string }]
}

export const Books = ({ mode, info }: Props) => {
	const handleClick = (link: string) => {
		window.open(link, '_blank')?.focus();
	};
	return (
		<>
			{mode === "Compact" ?
				<div className={styles.list}>
					<div className={styles.compactBooks}>
						<img src={info[0].coverImage} alt={info[0].bookName} />
						<div>
							<ArrowUpRight size={20} onClick={() => handleClick(info[0].link)} />
							<span>{info[0].bookName}</span>
							<p>{info[0].author}</p>
						</div>
					</div>
					<div className={styles.moreIcon}>
						<ArrowRight size={15} strokeWidth={2} className={`${styles.moreIcon} mr-5`} />
						책장 엿보기
					</div>
				</div> : null}
		</>
	)
}