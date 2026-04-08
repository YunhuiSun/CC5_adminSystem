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
  Select,
  InputNumber,
  message,
  Popconfirm,
} from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { Menu } from '@/types'
import { getMenuList, addMenu, updateMenu, deleteMenu } from '@/api/menu'
import { useThemeStore } from '@/store/themeStyle'
import styles from './index.module.css'

const MenuPage = () => {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [form] = Form.useForm()
  const [data, setData] = useState<Menu[]>([])
  const { themeStyle } = useThemeStore()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getMenuList()
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAdd = () => {
    setEditingMenu(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Menu) => {
    setEditingMenu(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMenu(id)
      message.success('删除成功')
      fetchData()
    } catch {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      if (editingMenu) {
        await updateMenu({ ...values, id: editingMenu.id })
        message.success('修改成功')
      } else {
        await addMenu(values)
        message.success('新增成功')
      }
      setModalVisible(false)
      fetchData()
    } catch {
      message.error('操作失败')
    }
  }

  const columns: ColumnsType<Menu> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
    },
    {
      title: '路径',
      dataIndex: 'path',
    },
    {
      title: '组件',
      dataIndex: 'component',
      render: (text) => text || '-',
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (type: number) => {
        const map: Record<number, string> = { 0: '目录', 1: '菜单', 2: '按钮' }
        return <Tag>{map[type]}</Tag>
      },
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
      title: '操作',
      key: 'action',
      width: 200,
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
          <Popconfirm
            title="确认删除"
            description="确定要删除该菜单吗？"
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
              placeholder="请输入菜单名称"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Button type="primary">搜索</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增菜单
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={editingMenu ? '编辑菜单' : '新增菜单'}
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
          initialValues={{ type: 1, status: 1, sort: 1 }}
        >
          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>

          <Form.Item
            name="path"
            label="路由路径"
            rules={[{ required: true, message: '请输入路由路径' }]}
          >
            <Input placeholder="请输入路由路径" />
          </Form.Item>

          <Form.Item
            name="component"
            label="组件路径"
          >
            <Input placeholder="请输入组件路径" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="图标"
          >
            <Input placeholder="请输入图标名称" />
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              <Select.Option value={0}>目录</Select.Option>
              <Select.Option value={1}>菜单</Select.Option>
              <Select.Option value={2}>按钮</Select.Option>
            </Select>
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
    </div>
  )
}

export default MenuPage
