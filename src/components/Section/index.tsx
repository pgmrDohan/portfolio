import styles from './index.module.scss';
import {Link} from 'lucide-react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
	title: string;
	Icon: React.ElementType;
};


export const Section: React.FunctionComponent<Props> = ({ id, children, title, Icon=null, className, ...rest }) => {
	return (
		<div id={id} {...rest} className={[styles.content, className].filter(Boolean).join(' ')}>
			<span className={`typo-h4 ${styles.Title}`} onClick={()=>window.navigator.clipboard.writeText(`https://www.dohan.in/#${id}`)}>{title}{Icon?<Icon className={`${styles.Icon} ml-xs`}/>:<></>}<Link className={styles.Link} /></span>
			{children}
		</div>
	)
}