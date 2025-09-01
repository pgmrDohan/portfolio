import { useDrawSVG } from "@/hooks"
import { Rss } from "lucide-react"
import styles from './index.module.scss'

type Props = React.HTMLAttributes<HTMLDivElement> & {
	drawDuration: number,
	maintainDuration: number,
	delay: number,
	fadeDuration: number
}

export const Footer = ({ drawDuration, maintainDuration, fadeDuration, delay, className }: Props) => {
	const pathRef = useDrawSVG(drawDuration, maintainDuration, fadeDuration, delay);

	return (
		<div className={`typo-body ${styles.Footer} ${className}`}>
			<nav className="mb-xs">
				<span>Home</span>
				<span>Projects</span>
				<span>Blog</span>
				<span>Experiences</span>
				<span>Bookshelf</span>
			</nav>
			<hr />
			<div>
				<p><Rss className={styles.Icon} />RSS</p>
				<span>PDF Version CV</span>
				<span>CC BY 4.0</span>
			</div>
			<svg className={styles.Signiture} width="1332" height="524" viewBox="0 0 1332 524" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					ref={pathRef}
					d="M434.272 236.003C434.272 236.003 425.272 368.502 427.771 421.002C430.271 473.502 471.269 403.502 492.772 316.003C514.275 228.504 464.772 139.002 442.771 244.502C420.769 350.001 416.271 458.002 416.271 458.002C430.769 373.502 517.269 285.999 530.769 293.999C544.269 301.999 509.269 394.836 524.269 396.502C539.269 398.168 606.769 132.5 628.269 140.5C649.769 148.5 594.269 415 594.269 415C594.269 415 618.769 267.5 645.269 267.5C671.769 267.5 642.269 415 642.269 415C682.769 318.5 731.269 304 731.269 304C713.269 313 687.769 394.5 702.769 387C717.769 379.5 727.669 309.9 731.269 309.5C734.869 309.1 742.435 348 745.769 367.5C754.269 332.334 776.669 262.3 798.269 263.5C819.869 264.7 811.769 362.5 792.769 362.5C773.769 362.5 820.769 228.5 864.769 226C908.769 223.5 921 391.5 854.769 412C788.537 432.501 779 404.5 759.269 401.5C739.537 398.501 47.7782 464.5 6.26905 391C-35.2401 317.5 331.781 108.001 357.779 121C383.777 134 177.277 475.622 158.777 458.002C140.277 440.381 305.443 248.25 315.277 260.5C325.112 272.75 119.777 507.5 126.277 516C132.777 524.5 267.277 350.5 388.777 281C315.277 323.043 201.277 438.8 205.277 444C340.611 355.833 616.884 180.5 603.777 160C590.67 139.5 294.777 311 331.277 490C367.777 669 1328.78 3 1328.78 3"
					stroke="#9CA2A7" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</div>
	)
}