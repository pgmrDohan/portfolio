import styles from './index.module.scss';
import { PersonalInfo, Contact, Section } from '@/components';
import { FloppyDisk, WavingHand, OpticalDisk, Bookmark, Scroll, FilmFrames, OpenBook } from '@/assets';

export function Home() {
	return (
		<>
			<PersonalInfo profileImage="profileImage.png" name="권도한" pronounce='/kwʌn·do·ɑn/' />
			<Contact info={
				{
					Mail: {
						link: "mailto:me@dohan.in",
						text: "me@dohan.in"
					},
					Github: {
						link: "https://github.com/pgmrDohan",
						text: "@pgmrDohan"
					},
					Instagram: {
						link: "https://instagram.com/i70h4n",
						text: "@i70h4n"
					},
					Discord: {
						link: "https://discord.gg/dbqcFRdtHX",
						text: "/dbqcFRdtHX"
					},
				}
			} />
			<Section id="introduce" title="안녕하세요" Icon={WavingHand} className={styles.typo}>
			</Section>
			<Section id="projects" title="프로젝트" Icon={OpticalDisk}>
			</Section>
			<Section id="skills" title="핵심 기술" Icon={FloppyDisk} className={styles.typo}>
			</Section>
			<Section id="posts" title="최신 게시글" Icon={Bookmark}>
			</Section>
			<Section id="experiences" title="대외 활동" Icon={Scroll}>
			</Section>
			<Section id="careers" title="경력" Icon={FilmFrames}>
			</Section>
			<Section id="books" title="읽고 있는 책" Icon={OpenBook}>
			</Section>
		</>
	)
};