import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import imgXk from '@/assets/xk.jpg';
import { useSelector } from 'react-redux';
import type { RootState, AppDispatch } from 'reduxDir/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/userSlice';

// import { SetGlobalStateFnContext } from '@/context/globalStateContest';

export default function Login() {
    const navigate = useNavigate();
    // 解决createAsyncThunk类型推导的bug
    const dispatch = useDispatch<AppDispatch>();

    // const setGlobalStateFn = useContext(SetGlobalStateFnContext)

    const isAuthenticated = useSelector((state: RootState) => state.user.token);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onFinish = (val: { account: string; cipher: string }) => {
        dispatch(login(val));
    };

    return (
        <div
            className="bg-no-repeat bg-center bg-cover h-screen w-full flex justify-center items-center"
            style={{ backgroundImage: `url(${imgXk})` }}
        >
            <Form
                name="normal_login"
                className="w-96"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="account"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Account!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Account" />
                </Form.Item>
                <Form.Item
                    name="cipher"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item className="text-center">
                    <Button type="primary" htmlType="submit">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
