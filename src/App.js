import React, { useState, useEffect } from 'react';

// 模拟数据（实际使用时从API获取）
const MOCK_DATA = [
  { id: "1", title: "A股三大指数今日涨跌不一，沪指小幅收涨0.32%", source: "新浪财经", time: "15:30", url: "#", summary: "今日盘面上，煤炭、汽车整车、银行等板块涨幅居前" },
  { id: "2", title: "央行：保持流动性合理充裕，降低企业融资成本", source: "东方财富", time: "14:45", url: "#", summary: "央行发布2024年第一季度货币政策执行报告" },
  { id: "3", title: "证监会：全面实行股票发行注册制改革正式启动", source: "财联社", time: "14:20", url: "#", summary: "证监会表示将进一步优化IPO定价机制" },
  { id: "4", title: "美联储主席鲍威尔：将继续加息控制通胀", source: "Reuters", time: "13:00", url: "#", summary: "美联储主席在听证会上表示通胀仍然过高" },
  { id: "5", title: "比亚迪发布2024年新车型，销量预期同比增长50%", source: "雪球", time: "12:30", url: "#", summary: "比亚迪今日发布多款新车型，覆盖纯电和混动" },
  { id: "6", title: "美股三大指数收盘涨跌不一，科技股普遍回调", source: "Bloomberg", time: "11:45", url: "#", summary: "纳斯达克指数小幅下跌，Apple、特斯拉股价承压" },
  { id: "7", title: "港股恒生指数低开高走，地产股表现强势", source: "东方财富", time: "11:00", url: "#", summary: "内房股集体反弹，碧桂园、恒大涨幅超10%" },
  { id: "8", title: "宁德时代一季度净利润同比增长20%，超出市场预期", source: "雪球", time: "10:30", url: "#", summary: "宁德时代发布财报，动力电池出货量创新高" },
  { id: "9", title: "欧洲央行维持利率不变，欧元汇率小幅下跌", source: "Reuters", time: "10:00", url: "#", summary: "欧洲央行继续维持三大关键利率不变" },
  { id: "10", title: "黄金价格突破2000美元/盎司，创近一年新高", source: "新浪财经", time: "09:30", url: "#", summary: "避险情绪升温，黄金ETF资金流入明显" },
];

const SOURCES = [
  { key: 'all', label: '全部' },
  { key: 'sina', label: '新浪' },
  { key: 'eastmoney', label: '东方财富' },
  { key: 'xueqiu', label: '雪球' },
  { key: 'reuters', label: 'Reuters' },
  { key: 'bloomberg', label: 'Bloomberg' },
];

const COLORS = {
  '新浪财经': '#E53935',
  '东方财富': '#1E88E5',
  '财联社': '#43A047',
  '雪球': '#FF7043',
  'Reuters': '#5C6BC0',
  'Bloomberg': '#FFA726',
};

function App() {
  const [news, setNews] = useState([]);
  const [activeSource, setActiveSource] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // 尝试从本地文件获取
      const res = await fetch('./news.json');
      const data = await res.json();
      setNews(data);
    } catch (e) {
      console.log('使用模拟数据');
      setNews(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = activeSource === 'all' 
    ? news 
    : news.filter(n => {
        const map = { 'sina': '新浪', 'eastmoney': '东方财富', 'xueqiu': '雪球', 'reuters': 'Reuters', 'bloomberg': 'Bloomberg' };
        return n.source.includes(map[activeSource]);
      });

  const getSourceColor = (source) => COLORS[source] || '#666';

  return (
    <div style={styles.container}>
      {/* 头部 */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>财经快讯</h1>
          <p style={styles.headerSubtitle}>{new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>

      {/* 筛选标签 */}
      <div style={styles.tabs}>
        {SOURCES.map(source => (
          <button
            key={source.key}
            style={[styles.tab, activeSource === source.key && styles.tabActive]}
            onClick={() => setActiveSource(source.key)}
          >
            {source.label}
          </button>
        ))}
      </div>

      {/* 新闻列表 */}
      <main style={styles.list}>
        {loading ? (
          <div style={styles.loading}>加载中...</div>
        ) : (
          filteredNews.map(item => (
            <a 
              key={item.id} 
              href={item.url} 
              style={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={styles.cardHeader}>
                <span style={[styles.sourceTag, { backgroundColor: getSourceColor(item.source) }]}>
                  {item.source}
                </span>
                <span style={styles.time}>{item.time}</span>
              </div>
              <h3 style={styles.title}>{item.title}</h3>
              {item.summary && <p style={styles.summary}>{item.summary}</p>}
            </a>
          ))
        )}
      </main>

      {/* 底部 */}
      <footer style={styles.footer}>
        <p>© 2024 财经快讯 · 数据来源：多家财经媒体</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F5F6F8',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  headerContent: {
    maxWidth: 600,
    margin: '0 auto',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  tabs: {
    display: 'flex',
    gap: 10,
    padding: 16,
    backgroundColor: '#fff',
    overflowX: 'auto',
    maxWidth: 600,
    margin: '0 auto',
  },
  tab: {
    padding: '8px 16px',
    borderRadius: 20,
    border: 'none',
    backgroundColor: '#F0F0F0',
    color: '#666',
    fontSize: 14,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  tabActive: {
    backgroundColor: '#1A1A1A',
    color: '#fff',
  },
  list: {
    maxWidth: 600,
    margin: '0 auto',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    display: 'block',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceTag: {
    padding: '4px 10px',
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 1.4,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.5,
  },
  loading: {
    textAlign: 'center',
    padding: 40,
    color: '#999',
  },
  footer: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
    fontSize: 12,
  },
};

export default App;
