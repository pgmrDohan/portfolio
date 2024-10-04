import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import sassDts from 'vite-plugin-sass-dts';
import path from 'path';

export default defineConfig({
	base: './',
	plugins: [react({
		devTarget: "esnext"
	}),
	svgr(), sassDts({
		enabledMode: ['production'],
		sourceDir: path.resolve(__dirname, './src'),
		outputDir: path.resolve(__dirname, './dist'),
	})],
	cacheDir: ".yarn/.vite",
	optimizeDeps: {
		exclude: ['blip-ds/loader'],
	},
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.css.ts'],
	},
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				silenceDeprecations: ['legacy-js-api'],
			},
		},
	},
	build: {
		cssCodeSplit: true,
		emptyOutDir: false,
	},
});