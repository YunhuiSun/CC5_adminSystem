import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic } from 'antd'
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useThemeStore } from '@/store/themeStyle'
import styles from './index.module.css'

// Obsidian ECharts theme colors
const obsidianLineOption = {
  backgroundColor: 'transparent',
  title: {
    text: '访问趋势',
    left: 'center',
    textStyle: {
      color: '#ffffff',
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#202024',
    borderColor: 'rgba(255,255,255,0.1)',
    textStyle: { color: '#ffffff' },
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    axisLabel: { color: '#71717a' },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    axisLabel: { color: '#71717a' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(212, 168, 83, 0.3)' },
            { offset: 1, color: 'rgba(212, 168, 83, 0.0)' },
          ],
        },
      },
      itemStyle: { color: '#d4a853' },
      lineStyle: { color: '#d4a853', width: 2 },
    },
  ],
}

const obsidianPieOption = {
  backgroundColor: 'transparent',
  title: {
    text: '用户分布',
    left: 'center',
    textStyle: {
      color: '#ffffff',
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: '#202024',
    borderColor: 'rgba(255,255,255,0.1)',
    textStyle: { color: '#ffffff' },
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: { color: '#a1a1aa' },
  },
  series: [
    {
      name: '用户来源',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#141416',
        borderWidth: 2,
      },
      label: { show: false, position: 'center' },
      emphasis: {
        label: { show: true, fontSize: 20, fontWeight: 'bold', color: '#fff' },
      },
      labelLine: { show: false },
      data: [
        { value: 1048, name: '搜索引擎', itemStyle: { color: '#d4a853' } },
        { value: 735, name: '直接访问', itemStyle: { color: '#60a5fa' } },
        { value: 580, name: '邮件营销', itemStyle: { color: '#4ade80' } },
        { value: 484, name: '联盟广告', itemStyle: { color: '#f87171' } },
        { value: 300, name: '视频广告', itemStyle: { color: '#fbbf24' } },
      ],
    },
  ],
}

const obsidianBarOption = {
  backgroundColor: 'transparent',
  title: {
    text: '每周订单',
    left: 'center',
    textStyle: {
      color: '#ffffff',
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#202024',
    borderColor: 'rgba(255,255,255,0.1)',
    textStyle: { color: '#ffffff' },
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    axisLabel: { color: '#71717a' },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    axisLabel: { color: '#71717a' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
  },
  series: [
    {
      name: '订单数',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 130],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#d4a853' },
            { offset: 1, color: '#b8923d' },
          ],
        },
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
}

// Default theme chart options
const defaultLineOption = {
  title: { text: '访问趋势', left: 'center' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [{
    name: '访问量', type: 'line', smooth: true,
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(24, 144, 255, 0.3)' }, { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }] } },
    itemStyle: { color: '#1890ff' },
  }],
}

const defaultPieOption = {
  title: { text: '用户分布', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{
    name: '用户来源', type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false,
    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
    label: { show: false, position: 'center' },
    emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
    labelLine: { show: false },
    data: [{ value: 1048, name: '搜索引擎' }, { value: 735, name: '直接访问' }, { value: 580, name: '邮件营销' }, { value: 484, name: '联盟广告' }, { value: 300, name: '视频广告' }],
  }],
}

const defaultBarOption = {
  title: { text: '每周订单', left: 'center' },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [{ name: '订单数', type: 'bar', data: [120, 200, 150, 80, 70, 110, 130], itemStyle: { color: '#52c41a' } }],
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const { themeStyle } = useThemeStore()

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const isObsidian = themeStyle === 'obsidian'
  const lineOption = isObsidian ? obsidianLineOption : defaultLineOption
  const pieOption = isObsidian ? obsidianPieOption : defaultPieOption
  const barOption = isObsidian ? obsidianBarOption : defaultBarOption

  return (
    <div className={`${styles.container} ${styles[themeStyle]}`}>
      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic title="总用户数" value={112893} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic title="总订单数" value={8846} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic title="总销售额" value={112893} prefix={<DollarOutlined />} suffix="元" />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic title="今日访问" value={1234} prefix={<EyeOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* 折线图 */}
      <Card className={styles.chartCard} loading={loading}>
        <ReactECharts option={lineOption} style={{ height: 350 }} />
      </Card>

      {/* 饼图和柱状图 */}
      <Row gutter={16} className={styles.bottomCharts}>
        <Col span={12}>
          <Card loading={loading}>
            <ReactECharts option={pieOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card loading={loading}>
            <ReactECharts option={barOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
