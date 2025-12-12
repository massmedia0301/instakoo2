import React, { useState } from 'react';

interface RechargePageProps {
  onBack: () => void;
}

const RechargePage: React.FC<RechargePageProps> = ({ onBack }) => {
  const [amount, setAmount] = useState<number>(30000);
  const [method, setMethod] = useState<'CARD' | 'TRANSFER'>('CARD');

  const amounts = [10000, 30000, 50000, 100000, 300000];

  const handlePayment = () => {
      // Save recharge to LocalStorage for Admin Demo
      const recharges = JSON.parse(localStorage.getItem('site_recharges') || '[]');
      recharges.unshift({
          id: Date.now(),
          user: 'Guest_User', // In real app this would be logged in user
          amount: amount,
          method: method,
          date: new Date().toISOString()
      });
      localStorage.setItem('site_recharges', JSON.stringify(recharges));

      alert(`${amount.toLocaleString()}원 충전이 요청되었습니다.`);
      onBack();
  };

  return (
    <div className="min-h-screen bg-primaryBg flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-lg animate-bounce-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">포인트 충전</h2>
          <p className="text-gray-500 text-sm mt-1">지금 충전하고 10% 추가 보너스를 받으세요!</p>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">충전 금액 선택</label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${
                  amount === amt 
                  ? 'bg-primary text-white shadow-md transform -translate-y-0.5' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {amt.toLocaleString()}원
              </button>
            ))}
            <button
               onClick={() => setAmount(0)} // Logic for custom input could be added
               className={`py-3 rounded-xl text-sm font-bold transition-all bg-gray-50 text-gray-600 hover:bg-gray-100`}
            >
              직접 입력
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
             <span className="text-gray-500 font-medium">최종 충전 포인트</span>
             <span className="text-primary font-extrabold text-xl">
               {(amount * 1.1).toLocaleString()} P
               <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full ml-2 align-middle">+10%</span>
             </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
           <label className="block text-sm font-bold text-gray-700 mb-3">결제 수단</label>
           <div className="flex gap-4">
             <button
               onClick={() => setMethod('CARD')}
               className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                 method === 'CARD' ? 'border-primary bg-pink-50 text-primary' : 'border-gray-100 text-gray-400'
               }`}
             >
               <i className="fa-regular fa-credit-card text-2xl"></i>
               <span className="font-bold text-sm">신용카드</span>
             </button>
             <button
               onClick={() => setMethod('TRANSFER')}
               className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                 method === 'TRANSFER' ? 'border-primary bg-pink-50 text-primary' : 'border-gray-100 text-gray-400'
               }`}
             >
               <i className="fa-solid fa-won-sign text-2xl"></i>
               <span className="font-bold text-sm">계좌이체</span>
             </button>
           </div>
        </div>

        <button 
          onClick={handlePayment}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-primaryLight transition-colors text-lg mb-4"
        >
          {amount.toLocaleString()}원 결제하기
        </button>

        <button 
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-dark transition-colors text-sm"
        >
            <i className="fa-solid fa-arrow-left"></i>
            뒤로가기
        </button>

      </div>
    </div>
  );
};

export default RechargePage;