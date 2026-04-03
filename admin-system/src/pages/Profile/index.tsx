import { useState, useEffect } from 'react'
import {
  Card,
  Avatar,
  Descriptions,
  Button,
  Form,
  Input,
  message,
  Tabs,
  Row,
  Col,
} from 'antd'
import { UserOutlined, EditOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store/user'
import { updateUser, changePassword } from '@/api/user'
import styles from './index.module.css'

const { TabPane } = Tabs

const ProfilePage = () => {
  const { user, setUser } = useUserStore()
  const [basicForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [basicLoading, setBasicLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (user) {
      basicForm.setFieldsValue({
        nickname: user.nickname,
        email: user.email,
        phone: user.phone,
      })
    }
  }, [user, basicForm])

  const handleBasicSubmit = async () => {
    try {
      setBasicLoading(true)
      const values = await basicForm.validateFields()
      await updateUser({ ...values, id: user?.id })
      setUser({ ...user!, ...values })
      message.success('基本信息更新成功')
    } catch {
      message.error('更新失败')
    } finally {
      setBasicLoading(false)
    }
  }

  const handlePasswordSubmit = async () => {
    try {
      setPasswordLoading(true)
      const values = await passwordForm.validateFields()
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      })
      message.success('密码修改成功')
      passwordForm.resetFields()
    } catch (error: any) {
      message.error(error.response?.data?.message || '修改失败')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Row gutter={24}>
        <Col span={8}>
          <Card className={styles.profileCard}>
            <div className={styles.avatarSection}>
              <Avatar size={100} icon={<UserOutlined />} className={styles.avatar} />
              <h3 className={styles.username}>{user?.nickname || user?.username}</h3>
              <p className={styles.role}>{user?.roleName || '普通用户'}</p>
            </div>
            <Descriptions column={1} className={styles.infoList}>
              <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user?.email || '-'}</Descriptions.Item>
              <Descriptions.Item label="手机号">{user?.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {user?.status === 1 ? '正常' : '禁用'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <Tabs defaultActiveKey="basic">
              <TabPane
                tab={
                  <span>
                    <EditOutlined />
                    基本信息
                  </span>
                }
                key="basic"
              >
                <Form
                  form={basicForm}
                  layout="vertical"
                  className={styles.form}
                >
                  <Form.Item
                    name="nickname"
                    label="昵称"
                    rules={[{ required: true, message: '请输入昵称' }]}
                  >
                    <Input placeholder="请输入昵称" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input placeholder="请输入邮箱" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="手机号"
                    rules={[{ required: true, message: '请输入手机号' }]}
                  >
                    <Input placeholder="请输入手机号" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={handleBasicSubmit}
                      loading={basicLoading}
                    >
                      保存修改
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <LockOutlined />
                    修改密码
                  </span>
                }
                key="password"
              >
                <Form
                  form={passwordForm}
                  layout="vertical"
                  className={styles.form}
                >
                  <Form.Item
                    name="oldPassword"
                    label="原密码"
                    rules={[{ required: true, message: '请输入原密码' }]}
                  >
                    <Input.Password placeholder="请输入原密码" />
                  </Form.Item>
                  <Form.Item
                    name="newPassword"
                    label="新密码"
                    rules={[
                      { required: true, message: '请输入新密码' },
                      { min: 6, message: '密码长度不能少于6位' },
                    ]}
                  >
                    <Input.Password placeholder="请输入新密码" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="确认新密码"
                    rules={[
                      { required: true, message: '请确认新密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'))
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="请确认新密码" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={handlePasswordSubmit}
                      loading={passwordLoading}
                    >
                      修改密码
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProfilePage
