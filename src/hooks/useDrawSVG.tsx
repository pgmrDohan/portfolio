import { useEffect, useRef } from "react";

export const useDrawSVG = (drawDuration: number, maintainDuration: number, fadeDuration: number, delay: number) => {
	const pathRef = useRef(null);

	useEffect(() => {
		if (!pathRef.current) return;

		const path: SVGGeometryElement = pathRef.current;
		const length = path.getTotalLength();

		// Calculate the total cycle duration
		const totalDuration = drawDuration + maintainDuration + fadeDuration + delay;

		// Calculate percentages for each phase
		const delayPercent = (delay / totalDuration) * 100;
		const drawPercent = ((delay + drawDuration) / totalDuration) * 100;
		const maintainPercent = ((delay + drawDuration + maintainDuration) / totalDuration) * 100;

		// Create a style element
		const style = document.createElement('style');
		style.textContent = `
      @keyframes drawMaintainFadeDelay {
        0%, ${delayPercent}% {
          stroke-dashoffset: ${length};
          opacity: 1;
        }
        ${drawPercent}%, ${maintainPercent}% {
          stroke-dashoffset: 0;
          opacity: 1;
        }
        100% {
          stroke-dashoffset: 0;
          opacity: 0;
        }
      }
    `;
		document.head.append(style);

		// Set up the path styles
		path.style.strokeDasharray = `${length}`;
		path.style.strokeDashoffset = `${length}`;

		// Set the animation
		path.style.animation = `drawMaintainFadeDelay ${totalDuration}s linear infinite`;

		// Cleanup
		return () => {
			document.head.removeChild(style);
		};
	}, [drawDuration, maintainDuration, fadeDuration, delay]);

	return pathRef;
}