import styles from './index.module.scss';
import {Link} from 'lucide-react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
	title: string;
};


export const Content: React.FunctionComponent<Props> = ({ id, children, title, className, ...rest }) => {
	return (
		<div id={id} {...rest} className={[styles.content, className].filter(Boolean).join(' ')}>
			<span className={styles.Title} onClick={()=>window.navigator.clipboard.writeText(`https://www.dohan.in/#${id}`)}>{title}<Link/></span>
			{children}
		</div>
	)
}