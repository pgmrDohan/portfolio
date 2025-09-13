import { ArrowRight, Heart } from "lucide-react";
import styles from "./index.module.scss";

type Props = {
	info: { [key: string]: { date: EpochTimeStamp } }
};

export const Posts = ({ info }: Props) => {
	return (
		<ul className={styles.Posts}>
			{Object.entries(info).map(([key, { date }], i) => {
				return (
					<li key={i} className={`${styles.listElement} typo-h5`}>
						<div>
							{key}
							<p className="typo-body mt-10">{(new Date(date * 1000)).toLocaleString("en-KR", { hour12: false, timeZoneName: "shortOffset" })}</p>
						</div>
						<Heart strokeWidth={2} color="#781212" fill="transparent" size={24} />
					</li>
				);
			})}
			<li className={`typo-body ${styles.moreIcon}`}>
				<ArrowRight size={15} strokeWidth={2} className={`${styles.moreIcon} mr-5`} />
				게시글 더보기
			</li>
		</ul>
	)
}