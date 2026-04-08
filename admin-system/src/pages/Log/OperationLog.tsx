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
} from 'antd'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { OperationLog } from '@/types'
import { getOperationLogList, clearOperationLog, deleteOperationLog } from '@/api/log'
import { useThemeStore } from '@/store/themeStyle'
import styles from './index.module.css'

const OperationLogPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<OperationLog[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [keyword, setKeyword] = useState('')
  const { themeStyle } = useThemeStore()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getOperationLogList({ pageNum, pageSize, module: keyword })
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

  const handleClear = async () => {
    try {
      await clearOperationLog()
      message.success('清空成功')
      fetchData()
    } catch {
      message.error('清空失败')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteOperationLog(id)
      message.success('删除成功')
      fetchData()
    } catch {
      message.error('删除失败')
    }
  }

  const columns: ColumnsType<OperationLog> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '操作用户',
      dataIndex: 'username',
    },
    {
      title: '操作模块',
      dataIndex: 'module',
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          '新增': 'green',
          '修改': 'blue',
          '删除': 'red',
          '查询': 'default',
        }
        return <Tag color={colorMap[type]}>{type}</Tag>
      },
    },
    {
      title: '操作描述',
      dataIndex: 'description',
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
      render: (method: string) => {
        const colorMap: Record<string, string> = {
          'GET': 'blue',
          'POST': 'green',
          'PUT': 'orange',
          'DELETE': 'red',
        }
        return <Tag color={colorMap[method]}>{method}</Tag>
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
    },
    {
      title: '耗时(ms)',
      dataIndex: 'duration',
      render: (duration: number) => (
        <span style={{ color: duration > 500 ? 'red' : 'inherit' }}>
          {duration}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
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
    <div className={`${styles.container} ${styles[themeStyle]}`}>
      <Card>
        <div className={styles.toolbar}>
          <Space>
            <Input
              placeholder="请输入操作用户"
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
            description="确定要清空所有操作日志吗？此操作不可恢复！"
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

export default OperationLogPage
