import React, { useEffect, useState } from 'react';

interface AdminPageProps {
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [rechargeHistory, setRechargeHistory] = useState<any[]>([]);
  const [signupHistory, setSignupHistory] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState({
    visitors: 0,
    signups: 0,
    revenue: 0,
    pendingOrders: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching delay
    setTimeout(() => {
        loadData();
    }, 500);
  }, []);

  const loadData = () => {
    try {
        // 1. Fetch Traffic
        const rawTraffic = JSON.parse(localStorage.getItem('site_traffic') || '[]');
        
        // Process Traffic for Chart (Group by Hour)
        const today = new Date().toDateString();
        const todaysTraffic = rawTraffic.filter((t: any) => new Date(t.timestamp).toDateString() === today);
        
        const hourCounts = new Array(24).fill(0);
        todaysTraffic.forEach((t: any) => {
            const hour = new Date(t.timestamp).getHours();
            hourCounts[hour]++;
        });

        // Filter out empty hours for cleaner chart, or take specific intervals
        // For demo: showing some key hours
        const chartData = [
            { hour: '00시', visits: hourCounts[0] },
            { hour: '04시', visits: hourCounts[4] },
            { hour: '08시', visits: hourCounts[8] },
            { hour: '12시', visits: hourCounts[12] },
            { hour: '16시', visits: hourCounts[16] },
            { hour: '20시', visits: hourCounts[20] },
            { hour: '23시', visits: hourCounts[23] },
        ];
        
        // If data is all zero (fresh start), add some dummy baseline for visual test if desired, 
        // BUT user asked for "Real Data", so we keep it real (0 if no visits).
        // However, to make the chart visible immediately since the user is currently visiting:
        // The App.tsx logs a visit on mount. So there should be at least 1 visit.
        setTrafficData(chartData);

        // 2. Fetch Users
        const users = JSON.parse(localStorage.getItem('site_users') || '[]');
        setSignupHistory(users.slice(0, 10)); // Top 10 recent

        // 3. Fetch Recharges & Orders for Revenue
        const recharges = JSON.parse(localStorage.getItem('site_recharges') || '[]');
        setRechargeHistory(recharges.slice(0, 10));

        const orders = JSON.parse(localStorage.getItem('site_orders') || '[]');

        // 4. Calculate Stats
        const todaysSignups = users.filter((u: any) => new Date(u.date).toDateString() === today).length;
        
        // Revenue = Today's Orders + Today's Recharges
        const todaysOrdersVal = orders
            .filter((o: any) => new Date(o.date).toDateString() === today)
            .reduce((sum: number, o: any) => sum + o.amount, 0);
            
        const todaysRechargeVal = recharges
            .filter((r: any) => new Date(r.date).toDateString() === today)
            .reduce((sum: number, r: any) => sum + r.amount, 0);

        setTodayStats({
            visitors: todaysTraffic.length,
            signups: todaysSignups,
            revenue: todaysOrdersVal + todaysRechargeVal,
            pendingOrders: orders.length // Assuming all are pending in this simple demo
        });

        setLoading(false);

    } catch (e) {
        console.error("Failed to load admin data", e);
        setLoading(false);
    }
  };

  const maxVisits = Math.max(...trafficData.map(d => d.visits)) || 1; // Avoid divide by zero

  const formatDate = (isoString: string) => {
      const d = new Date(isoString);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500 font-bold">데이터 로딩중...</div>
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Admin Navbar */}
      <nav className="bg-slate-800 text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white font-bold p-2 rounded-lg text-sm">ADMIN</div>
          <h1 className="text-xl font-bold tracking-tight">instakoo 관리자</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm">관리자(ung1994)님 환영합니다.</span>
          <button 
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            로그아웃
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-400 text-xs font-bold uppercase mb-2">오늘 방문자</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{todayStats.visitors.toLocaleString()}</h3>
            <p className="text-green-500 text-xs mt-2 font-bold">실시간 집계 중</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <p className="text-slate-400 text-xs font-bold uppercase mb-2">오늘 신규가입</p>
            <h3 className="text-3xl font-extrabold text-slate-800">{todayStats.signups.toLocaleString()}</h3>
            <p className="text-green-500 text-xs mt-2 font-bold">{todayStats.signups > 0 ? '▲ 증가' : '-'}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <p className="text-slate-400 text-xs font-bold uppercase mb-2">오늘 매출액</p>
            <h3 className="text-3xl font-extrabold text-primary">₩{todayStats.revenue.toLocaleString()}</h3>
            <p className="text-slate-400 text-xs mt-2 font-bold">주문 + 충전 합계</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <p className="text-slate-400 text-xs font-bold uppercase mb-2">누적 주문 건수</p>
            <h3 className="text-3xl font-extrabold text-orange-500">{todayStats.pendingOrders}</h3>
            <p className="text-slate-400 text-xs mt-2">전체 데이터 기준</p>
          </div>
        </div>

        {/* Traffic Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-blue-500"></i>
            오늘 시간대별 트래픽 (실시간)
          </h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {trafficData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                <div className="relative w-full max-w-[60px] bg-blue-50 rounded-t-lg overflow-hidden flex items-end h-full">
                    <div 
                        style={{ height: `${data.visits > 0 ? (data.visits / maxVisits) * 100 : 2}%` }} // Min height 2% for visuals
                        className={`w-full transition-all duration-500 rounded-t-lg relative group-hover:opacity-90 ${data.visits > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-slate-200'}`}
                    >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {data.visits}명
                        </div>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 font-medium">{data.hour}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">* 실제 방문 시 자동으로 그래프가 업데이트됩니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Recharges */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <i className="fa-solid fa-credit-card text-green-500"></i>
                    최근 포인트 충전 내역
                </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">User</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3 rounded-r-lg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rechargeHistory.length === 0 ? (
                      <tr>
                          <td colSpan={4} className="text-center py-8 text-slate-400">아직 충전 내역이 없습니다.</td>
                      </tr>
                  ) : (
                    rechargeHistory.map((item: any) => (
                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">{item.user}</td>
                        <td className="px-4 py-3 text-primary font-bold">+{item.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.method === 'CARD' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                                {item.method}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{formatDate(item.date)}</td>
                        </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Signups */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <i className="fa-solid fa-user-plus text-orange-500"></i>
                    최근 가입 회원
                </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Email</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3 rounded-r-lg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {signupHistory.length === 0 ? (
                      <tr>
                          <td colSpan={3} className="text-center py-8 text-slate-400">아직 가입 회원이 없습니다.</td>
                      </tr>
                  ) : (
                    signupHistory.map((item: any) => (
                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">{item.email}</td>
                        <td className="px-4 py-3">
                            {item.source === 'Google' ? (
                                <span className="text-red-500 font-bold text-xs"><i className="fa-brands fa-google"></i> Google</span>
                            ) : (
                                <span className="text-slate-400 font-bold text-xs">Direct</span>
                            )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{formatDate(item.date)}</td>
                        </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;