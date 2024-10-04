import styles from './index.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement> & {
	title: string;
};


export const Content: React.FunctionComponent<Props> = ({ children, title, className, ...rest }) => {
	return (
		<div {...rest} className={[styles.content, className].filter(Boolean).join(' ')}>
			<span className={styles.Title}>{title}</span>
			{children}
		</div>
	)
}