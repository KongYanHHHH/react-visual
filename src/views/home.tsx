import { Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { selectUserInfo } from 'reduxDir/userSlice';

export default function Home() {
    const userInfo = useSelector(selectUserInfo);

    return (
        <div className="flex justify-center items-center flex-col h-96">
            <NavLink
                to="/about"
                className="text-2xl text-orange-600 underline "
            >
                About
            </NavLink>
            <p className="m-3">你好，{userInfo.name}!</p>
            <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                src={userInfo.avatar}
            />
            <a
                className="m-3 text-2xl"
                href="//visual.yan121.com"
                target="_blank"
                rel="noreferrer"
            >
                独立访问此站
            </a>
        </div>
    );
}
