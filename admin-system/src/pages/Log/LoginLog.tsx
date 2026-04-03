import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  message,
  Popconfirm,
  Modal,
} from 'antd'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { LoginLog } from '@/types'
import { getLoginLogList, clearLoginLog, deleteLoginLog } from '@/api/log'
import styles from './index.module.css'

const LoginLogPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<LoginLog[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [keyword, setKeyword] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getLoginLogList({ pageNum, pageSize, username: keyword })
      setData(res.list)
      setTotal(res.total)
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

  const handleClear = () => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有登录日志吗？此操作不可恢复！',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await clearLoginLog()
          message.success('清空成功')
          fetchData()
        } catch {
          message.error('清空失败')
        }
      },
    })
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteLoginLog(id)
      message.success('删除成功')
      fetchData()
    } catch {
      message.error('删除失败')
    }
  }

  const columns: ColumnsType<LoginLog> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
    },
    {
      title: '登录地点',
      dataIndex: 'location',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '登录信息',
      dataIndex: 'message',
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="确认删除"
          description="确定要删除该日志吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确认"
          cancelText="取消"
        >
          <Button danger size="small" icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.toolbar}>
          <Space>
            <Input
              placeholder="请输入用户名"
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
          <Popconfirm
            title="确认清空"
            description="确定要清空所有登录日志吗？此操作不可恢复！"
            onConfirm={handleClear}
            okText="确认"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              清空日志
            </Button>
          </Popconfirm>
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
    </div>
  )
}

export default LoginLogPage
