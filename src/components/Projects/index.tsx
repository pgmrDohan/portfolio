import { Github } from '@/assets'
import { useIcon } from '@/hooks'
import { ArrowRight } from 'lucide-react';
import styles from './index.module.scss'

type Props = {
	info: { [key: string]: { icon: string, year: number, link?: string, github?: string, desc: string } }
};

export const Projects = ({ info }: Props) => {
	const Link = useIcon("ExternalLink");

	const handleClick = (link: string) => {
		window.open(link, '_blank')?.focus();
	};

	return (
		<ul className={styles.projects}>
			{Object.entries(info).map(([key, { icon, year, link, github, desc }], i) => {
				return (
					<li key={i} className={`${styles.listElement} typo-body`}>
						<div className={styles.summary}>
							<img src={icon} alt="ProjectIcon" />
							<div className={styles.info}>
								<p className='typo-h5'>
									<span className='typo-body'>{year}</span>
									{key}
								</p>
								<div className={styles.Icon}>
									{link && <Link onClick={() => handleClick(link)} strokeWidth={2} />}
									{github && <Github onClick={() => handleClick(github)} />}
								</div>
							</div>
						</div>
						{desc}
					</li>
				);
			})}
			<li className={`${styles.moreIcon} typo-body`}>
				<ArrowRight size={15} strokeWidth={2} className="mr-5" />
				프로젝트 더보기
			</li>
		</ul>
	)
}