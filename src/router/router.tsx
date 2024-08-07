import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthRoute from './authRoute';

import Home from '../views/home';
import Login from '../views/login';
// import About from '../views/about';

const About = lazy(() => import('../views/about'));

export default function Router() {
    return (
        <BrowserRouter
            basename={
                window.__POWERED_BY_QIANKUN__ ? '/other/reactVisual' : '/'
            }
        >
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<AuthRoute />}>
                            <Route index element={<Home />} />
                        </Route>
                        <Route path="/about" element={<AuthRoute />}>
                            <Route index element={<About />} />
                        </Route>
                    </>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
