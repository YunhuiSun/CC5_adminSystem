/**
 * Obsidian Command Center ECharts Theme
 * A premium dark theme with warm amber accents
 */

export const obsidianEChartsTheme = {
  // Background
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#a1a1aa',
  },

  // Title
  title: {
    textStyle: {
      color: '#ffffff',
      fontFamily: "'Playfair Display', serif",
      fontWeight: 600,
      fontSize: 18,
    },
    subtextStyle: {
      color: '#71717a',
      fontSize: 13,
    },
  },

  // Legend
  legend: {
    textStyle: {
      color: '#a1a1aa',
    },
    pageTextStyle: {
      color: '#a1a1aa',
    },
    inactiveColor: '#52525b',
  },

  // Tooltip
  tooltip: {
    backgroundColor: '#202024',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    textStyle: {
      color: '#ffffff',
    },
    extraCssText: 'box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4); border-radius: 8px;',
  },

  // Grid
  grid: {
    borderColor: 'rgba(255,255,255,0.05)',
  },

  // Category Axis (x-axis for bar/line)
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
    axisLabel: {
      color: '#71717a',
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.05)',
      },
    },
  },

  // Value Axis (y-axis)
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
    axisLabel: {
      color: '#71717a',
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.05)',
      },
    },
  },

  // Log Axis
  logAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
    axisLabel: {
      color: '#71717a',
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.05)',
      },
    },
  },

  // Time Axis
  timeAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
    axisLabel: {
      color: '#71717a',
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.05)',
      },
    },
  },

  // Line Series
  line: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#d4a853',
      borderWidth: 2,
    },
    lineStyle: {
      color: '#d4a853',
      width: 2,
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(212, 168, 83, 0.3)' },
          { offset: 1, color: 'rgba(212, 168, 83, 0.0)' },
        ],
      },
    },
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
  },

  // Bar Series
  bar: {
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#d4a853' },
          { offset: 1, color: '#b8923d' },
        ],
      },
      borderRadius: [4, 4, 0, 0],
    },
    barMaxWidth: 40,
  },

  // Pie Series
  pie: {
    itemStyle: {
      borderColor: '#141416',
      borderWidth: 2,
    },
    label: {
      color: '#a1a1aa',
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 20,
        shadowColor: 'rgba(212, 168, 83, 0.3)',
      },
    },
  },

  // Scatter Series
  scatter: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#d4a853',
    },
  },

  // Boxplot Series
  boxplot: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#141416',
    },
  },

  // Effect Scatter
  effectScatter: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#d4a853',
    },
  },

  // Candlestick
  candlestick: {
    itemStyle: {
      color: '#4ade80',
      color0: '#f87171',
      borderColor: '#4ade80',
      borderColor0: '#f87171',
      borderColorDoji: '#a1a1aa',
    },
  },

  // Gauge
  gauge: {
    axisLine: {
      lineStyle: {
        color: [[1, '#d4a853']],
      },
    },
    axisTick: {
      lineStyle: {
        color: '#d4a853',
      },
    },
    detail: {
      color: '#ffffff',
    },
  },

  // Radar
  radar: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#d4a853',
    },
    lineStyle: {
      color: '#d4a853',
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(212, 168, 83, 0.3)' },
          { offset: 1, color: 'rgba(212, 168, 83, 0.0)' },
        ],
      },
    },
    name: {
      textStyle: {
        color: '#a1a1aa',
      },
    },
  },

  // Parallel Coordinates
  parallel: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#d4a853',
    },
    lineStyle: {
      color: '#d4a853',
    },
    axisBaseline: {
      color: '#52525b',
    },
  },

  // Sankey
  sankey: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#d4a853',
    },
    lineStyle: {
      color: 'gradient',
      curveness: 0.5,
    },
  },

  // Funnel
  funnel: {
    itemStyle: {
      borderColor: '#141416',
      borderWidth: 1,
    },
  },

  // Graph
  graph: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#141416',
    },
    lineStyle: {
      color: 'rgba(212, 168, 83, 0.3)',
      width: 1,
    },
    label: {
      color: '#a1a1aa',
    },
    labelLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.2)',
      },
    },
    nodeSymbol: 'circle',
  },

  // Map
  map: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#141416',
    },
    label: {
      color: '#ffffff',
    },
    emphasis: {
      itemStyle: {
        color: '#e8c078',
        borderColor: '#d4a853',
      },
      label: {
        color: '#ffffff',
      },
    },
  },

  // Geo
  geo: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#141416',
    },
    label: {
      color: '#ffffff',
    },
    emphasis: {
      itemStyle: {
        color: '#e8c078',
        borderColor: '#d4a853',
      },
      label: {
        color: '#ffffff',
      },
    },
  },

  // Category data zoom
  dataZoom: {
    backgroundColor: '#1a1a1e',
    dataBackgroundColor: 'rgba(212, 168, 83, 0.2)',
    fillerColor: 'rgba(212, 168, 83, 0.1)',
    handleColor: '#d4a853',
    handleSize: '100%',
    textStyle: {
      color: '#71717a',
    },
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Visual Map
  visualMap: {
    textStyle: {
      color: '#a1a1aa',
    },
    itemSymbol: 'circle',
  },

  // Timeline
  timeline: {
    lineStyle: {
      color: 'rgba(255,255,255,0.1)',
    },
    itemStyle: {
      color: '#d4a853',
      borderWidth: 1,
    },
    controlStyle: {
      color: '#d4a853',
      borderColor: '#d4a853',
    },
    checkpointStyle: {
      color: '#d4a853',
    },
    label: {
      color: '#71717a',
    },
    emphasis: {
      itemStyle: {
        color: '#e8c078',
      },
      label: {
        color: '#a1a1aa',
      },
    },
  },

  // Calendar
  calendar: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#141416',
    },
    dayLabel: {
      color: '#71717a',
    },
    monthLabel: {
      color: '#a1a1aa',
    },
    yearLabel: {
      color: '#71717a',
    },
  },

  // Bookmarks
  bookmark: {
    itemStyle: {
      color: '#d4a853',
      borderColor: '#d4a853',
    },
    emphasis: {
      itemStyle: {
        color: '#e8c078',
        borderColor: '#e8c078',
      },
    },
  },

  // Mark Point
  markPoint: {
    label: {
      color: '#ffffff',
    },
    emphasis: {
      label: {
        color: '#ffffff',
      },
    },
  },
}

export default obsidianEChartsTheme
