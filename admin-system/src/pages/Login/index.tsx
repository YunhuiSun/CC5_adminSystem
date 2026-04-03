import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store/user'
import { login } from '@/api/user'
import styles from './index.module.css'

const Login = () => {
  const navigate = useNavigate()
  const { setToken, setUser } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const usernameRef = useRef<any>(null)
  const passwordRef = useRef<any>(null)

  const onFinish = async (values: { username: string; password: string; remember?: boolean }) => {
    setLoading(true)
    setUsernameError('')
    setPasswordError('')
    try {
      const result = await login({ username: values.username, password: values.password })
      setToken(result.token)
      setUser(result.user)
      navigate('/')
    } catch (error: any) {
      const errorMsg = error.message || '登录失败'
      if (errorMsg.includes('用户不存在')) {
        setUsernameError('用户不存在')
        usernameRef.current?.focus()
      } else if (errorMsg.includes('密码错误')) {
        setPasswordError('密码错误')
        passwordRef.current?.focus()
      } else {
        setPasswordError(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="后台管理系统" bordered={false}>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
            validateStatus={usernameError ? 'error' : ''}
            help={usernameError}
          >
            <Input
              ref={usernameRef}
              prefix={<UserOutlined />}
              placeholder="用户名: admin"
              onChange={() => setUsernameError('')}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
            validateStatus={passwordError ? 'error' : ''}
            help={passwordError}
          >
            <Input.Password
              ref={passwordRef}
              prefix={<LockOutlined />}
              placeholder="密码: 123456"
              onChange={() => setPasswordError('')}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.tips}>
          <p>默认账号: admin / 123456</p>
          <p>普通用户: user / 123456</p>
        </div>
      </Card>
    </div>
  )
}

export default Login
