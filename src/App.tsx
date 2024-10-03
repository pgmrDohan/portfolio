import { RouterProvider } from 'react-router-dom';

import { useRouter } from '@/hooks';

const App = () => {
    const router = useRouter();

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;