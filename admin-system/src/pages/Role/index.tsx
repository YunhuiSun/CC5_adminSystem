import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Tree,
  Select,
  message,
  Popconfirm,
} from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Role } from '@/types'
import { getRoleList, addRole, updateRole, deleteRole, assignRolePermissions } from '@/api/role'
import { useThemeStore } from '@/store/themeStyle'
import styles from './index.module.css'

const RolePage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Role[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [permModalVisible, setPermModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [form] = Form.useForm()
  const { themeStyle } = useThemeStore()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getRoleList({ pageNum, pageSize, keyword })
      setData(res.list)
      setTotal(res.total)
    } catch {
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pageNum, pageSize])

  const handleSearch = () => {
    setPageNum(1)
    fetchData()
  }

  const handleAdd = () => {
    setEditingRole(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Role) => {
    setEditingRole(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id)
      message.success('删除成功')
      fetchData()
    } catch {
      message.error('删除失败')
    }
  }

  const handlePermission = (record: Role) => {
    setEditingRole(record)
    setPermModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingRole) {
        await updateRole({ ...values, id: editingRole.id })
        message.success('修改成功')
      } else {
        await addRole(values)
        message.success('新增成功')
      }
      setModalVisible(false)
      fetchData()
    } catch {
      message.error('操作失败')
    }
  }

  const handlePermSubmit = async () => {
    try {
      if (editingRole) {
        // 获取选中的权限
        const checkedKeys = form.getFieldValue('permissions') || []
        await assignRolePermissions(editingRole.id, checkedKeys)
        message.success('权限分配成功')
      }
      setPermModalVisible(false)
    } catch {
      message.error('权限分配失败')
    }
  }

  // 权限树数据
  const permissionTreeData = [
    {
      title: '数据看板',
      key: 'dashboard:view',
    },
    {
      title: '用户管理',
      key: 'user',
      children: [
        { title: '查看', key: 'user:list' },
        { title: '新增', key: 'user:add' },
        { title: '修改', key: 'user:edit' },
        { title: '删除', key: 'user:delete' },
      ],
    },
    {
      title: '角色管理',
      key: 'role',
      children: [
        { title: '查看', key: 'role:list' },
        { title: '新增', key: 'role:add' },
        { title: '修改', key: 'role:edit' },
        { title: '删除', key: 'role:delete' },
        { title: '分配权限', key: 'role:permission' },
      ],
    },
    {
      title: '菜单管理',
      key: 'menu',
      children: [
        { title: '查看', key: 'menu:list' },
        { title: '新增', key: 'menu:add' },
        { title: '修改', key: 'menu:edit' },
        { title: '删除', key: 'menu:delete' },
      ],
    },
    {
      title: '日志管理',
      key: 'log',
      children: [
        { title: '操作日志', key: 'log:operation' },
        { title: '登录日志', key: 'log:login' },
      ],
    },
  ]

  const columns: ColumnsType<Role> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handlePermission(record)}
          >
            权限
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除该角色吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className={`${styles.container} ${styles[themeStyle]}`}
      <Card>
        <div className={styles.toolbar}>
          <Space>
            <Input
              placeholder="请输入角色名称"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增角色
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            onChange: (page, size) => {
              setPageNum(page)
              setPageSize(size || 10)
            },
          }}
        />
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 1 }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>

          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码" disabled={!!editingRole} />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value={1}>正常</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="分配权限"
        open={permModalVisible}
        onOk={handlePermSubmit}
        onCancel={() => setPermModalVisible(false)}
        width={600}
        okText="确认"
        cancelText="取消"
      >
        <Tree
          checkable
          defaultExpandAll
          treeData={permissionTreeData}
          defaultCheckedKeys={editingRole?.permissions || []}
        />
      </Modal>
    </div>
  )
}

export default RolePage
