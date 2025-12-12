import React, { useState } from 'react';

interface SignupPageProps {
  onBack: () => void;
  onLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onBack, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if(!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    // Save to LocalStorage for Admin Demo
    try {
      const users = JSON.parse(localStorage.getItem('site_users') || '[]');
      const newUser = {
        id: Date.now(),
        email: email,
        date: new Date().toISOString(),
        source: 'Direct' // Simplified for demo
      };
      // Add to beginning of array
      users.unshift(newUser);
      localStorage.setItem('site_users', JSON.stringify(users));
      
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      onLogin();
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-primaryBg flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-md animate-bounce-in">
        <div className="text-center mb-8">
           <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform rotate-12">
               <span className="text-white font-bold text-md italic">in</span>
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight">instakoo</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">회원가입</h2>
          <p className="text-gray-500 text-sm mt-1">3초만에 가입하고 마케팅을 시작하세요!</p>
        </div>

        {/* Google Login Button */}
        <button 
          onClick={() => {
            // Simulate Google Signup
            const users = JSON.parse(localStorage.getItem('site_users') || '[]');
            users.unshift({
              id: Date.now(),
              email: `google_user_${Math.floor(Math.random()*1000)}@gmail.com`,
              date: new Date().toISOString(),
              source: 'Google'
            });
            localStorage.setItem('site_users', JSON.stringify(users));
            alert('구글 계정으로 가입되었습니다.');
            onLogin();
          }}
          className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 mb-6 relative overflow-hidden group"
        >
          <i className="fa-brands fa-google text-red-500 text-xl"></i>
          <span>Google 계정으로 계속하기</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative bg-white px-4 text-xs text-gray-400">또는 이메일로 가입</span>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">이메일</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="비밀번호 (8자 이상)"
            />
          </div>
           <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호 확인</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="비밀번호 다시 입력"
            />
          </div>

          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-primaryLight transition-colors mt-2">
            회원가입 완료
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요? 
          <button onClick={onLogin} className="ml-2 text-primary font-bold hover:underline">로그인</button>
        </p>

        <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
                onClick={onBack}
                className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-dark transition-colors"
            >
                <i className="fa-solid fa-house"></i>
                홈으로 돌아가기
            </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;