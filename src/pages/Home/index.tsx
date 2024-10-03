import styles from './index.module.scss';
import { MyInfo, Contact, Content } from '@/components';
import { profileImage } from '@/assets';

export function Home() {
	return (
		<div className={styles.Home}>
			<MyInfo profileImage={profileImage} name="권도한" pronounce='/kwʌn·do·ɑn/' />
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
			<Content title="안녕하세요 👋" className={styles.typo}>
				<p><strong>사람과 사람, 사람과 사물을 연결하는</strong> 개발자, 권도한입니다.</p>
				<p>2020년에 한국에서 소프트웨어 개발을 시작해 기술 스택을 키워나가며 다양한 서비스를 개발해왔습니다. 현재, 다양한 영역에서 개인 프리랜서 개발자로 활동하고 있습니다.</p>
				<p>모든 서비스는 사람과 무언가를 연결하는 간단한 개념에서 출발한다고 생각합니다. 저는 이러한 연결을 통해 <strong>사회적, 기술적 발전에 기여하고자</strong> 합니다. <strong>사람 본연의 연결성을 보완</strong>하며 모두가 편리하고 즐겁게 사용할 수 있는 서비스를 만드는 것이 저의 목표입니다. 이를 위해 다양한 프로젝트를 통해 성장해왔으며, 모두가 함께 발전할 수 있는 미래를 위해 <strong>사람과 기술을 이어주는 혁신</strong>에 대해 끊임없이 고민하고 있습니다.</p>
			</Content>
			<Content title="프로젝트 💿">
			</Content>
			<Content title="핵심 기술 🖥" className={styles.typo}>
				<p><strong>저수준 프로그래밍 부터 고수준을 오가는</strong> 소프트웨어 개발</p>
				<p>C언어와 C++ 및 어셈블리어를 활용한 <strong>운영체제(커널)</strong> 개발</p>
				<p>버전 관리 시스템 <strong>GIT을 활용한 협업</strong> 프로젝트</p>
				<p>NodeJS와 Python 등 프레임워크를 활용한 <strong>웹 서버단</strong> 개발</p>
				<p>JS 프론트엔드 프레임워크를 통한 <strong>웹 디자인 퍼블리싱</strong></p>
				<p>Figma를 통한 <strong>UI/UX 디자인</strong></p>
			</Content>
			<Content title="최신 게시글 🔖">
			</Content>
			<Content title="대외 활동 📜">
			</Content>
			<Content title="경력 🎞">
			</Content>
			<Content title="읽고 있는 책 📚">
			</Content>
		</div >
	);
};