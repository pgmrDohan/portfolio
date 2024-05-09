import './styles.scss';

export default function Tag(props: { content: string, style?: React.CSSProperties }) {
	return (
		<div className="Tag" style={props.style}>
			{props.content}
		</div>
	)
}