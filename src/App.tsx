import type { RouteRecord } from 'vite-react-ssg'

import { Layout } from '@/components'
import {
	Home,
} from '@/pages'

export const routes: RouteRecord[] = [
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Home />,
			},
		],
	},
]