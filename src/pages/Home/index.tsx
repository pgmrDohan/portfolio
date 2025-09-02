import styles from './index.module.scss';
import { useDarkMode } from '@/hooks';
import { PersonalInfo, Contact } from '@/components';

export function Home() {
	const { toggleTheme } = useDarkMode();

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
		</>
	)
};