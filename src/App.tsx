import type { RouteRecord } from 'vite-react-ssg'

import { Layout } from '@/components'
import {
	Home,
	NotFound
} from '@/pages'

export const routes: RouteRecord[] = [
	{
		path: '/',
		element: <Layout />,
		errorElement: <NotFound />,
		children: [
			{
				index: true,
				element: <Home />,
			},
		],
	},
]