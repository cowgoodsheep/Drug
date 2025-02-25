import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Tabs, message, theme, Modal, Form, Input, Select } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerApi, login as loginApi } from '../../api/Api';
import mp from './mp.mp4'
const { Option } = Select;
type LoginType = 'telephone' | 'name';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const Page = () => {
  const [loginType, setLoginType] = useState<LoginType>('telephone');
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async (e) => {
    const data = await loginApi(e)
    if (data.length === 1) {
      console.log(data)
      localStorage.setItem('userinfo', JSON.stringify(data[0]))
      sessionStorage.setItem('pathname', '')
      navigate('/home')
      location.reload();
    } else {
      message.warning(data.data.msg)
    }
  }
  const register = async (value) => {
    await registerApi(value)
    message.success('注册成功')
    setIsModalOpen(false)
  }
  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <Modal title="注册新用户" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={register}
          autoComplete="off"
        >
          <Form.Item
            label="手机号"
            name="telephone"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="用户名称"
            name="user_name"
            rules={[{ required: true, message: '请输入用户名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select
              placeholder="请选择"
              allowClear
            >
              <Option value="客户">客户</Option>
              <Option value="供应商">供应商</Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 10, span: 16 }} >
            <Button type="primary" htmlType="submit">
              立即注册
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <LoginFormPage
        backgroundImageUrl="https://www.freeimg.cn/i/2023/12/23/65867de19f3bf.jpg"
        backgroundVideoUrl={mp}
        title="药品存销信息管理系统"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        onFinish={onFinish}
        subTitle="3121004661 刘浩洋"
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'telephone'} tab={'手机号登录'} />
          <Tabs.TabPane key={'name'} tab={'用户姓名登录'} />
        </Tabs>
        {loginType === 'telephone' && (
          <>
            <ProFormText
              name="telephone"
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        {loginType === 'name' && (
          <>
            <ProFormText
              name="user_name"
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'用户姓名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户姓名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
            onClick={() => showModal(true)}
          >
            注册用户
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};