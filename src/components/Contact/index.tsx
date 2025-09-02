import { Discord, Github, Instagram } from '@/assets';
import { useIcon } from '@/hooks';
import styles from './index.module.scss';

type Props = {
	info: { [key: string]: { link: string, text: string } }
};

export const Contact = ({ info }: Props) => {
	const Mail = useIcon("Mail");

	const iconMap: { [key: string]: React.ElementType } = {
		Mail,
		Github,
		Instagram,
		Discord
	};

	const handleClick = (link: string) => {
		window.open(link, '_blank')?.focus();
	};

	return (
		<ul className={styles.list}>
			{Object.entries(info).map(([key, { link, text }], i) => {
				const Icon = iconMap[key] || (() => null);
				return (
					<li key={i} onClick={() => handleClick(link)} className={`mt-sm typo-body ${styles.listElement}`}>
						<Icon strokeWidth={2} className={styles.Icon} />
						{text}
					</li>
				);
			})}
		</ul>
	);
};
