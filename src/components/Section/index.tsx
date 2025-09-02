import styles from './index.module.scss';
import {Link} from 'lucide-react';
import { toast } from '@/utils';

type Props = React.HTMLAttributes<HTMLDivElement> & {
	title: string;
	Icon: React.ElementType;
};


export const Section: React.FunctionComponent<Props> = ({ id, children, title, Icon=null, className, ...rest }) => {
	const copyLink = (id:string) => {
		window.navigator.clipboard.writeText(`https://www.dohan.in/#${id}`);
		toast.show('복사되었습니다.');
	}

	return (
		<div id={id} {...rest} className={[styles.content, className].filter(Boolean).join(' ')}>
			<span className={`typo-h4 ${styles.Title}`} onClick={()=>{id && copyLink(id)}}>{title}{Icon?<Icon className={`${styles.Icon} ml-xs`}/>:<></>}<Link className={styles.Link} /></span>
			{children}
		</div>
	)
}