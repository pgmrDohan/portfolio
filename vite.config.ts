import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from 'path';

export default defineConfig({
	plugins: [react({
		devTarget: "esnext"
	}),
	svgr()],
	cacheDir: ".yarn/.vite",
	optimizeDeps: {
		exclude: ['blip-ds/loader'],
	},
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.css.ts'],
	},
	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: ['legacy-js-api'],
			},
		},
	},
});