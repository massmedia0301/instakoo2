import React, { useState, useEffect } from 'react';
import { Platform, ServiceOption } from '../types';
import { SERVICE_OPTIONS } from '../constants';

interface OrderFormProps {
  targetPlatform?: Platform | null;
}

type SpeedOption = 'FAST' | 'NORMAL' | 'ANY';

const OrderForm: React.FC<OrderFormProps> = ({ targetPlatform }) => {
  // Changed default to INSTAGRAM
  const [platform, setPlatform] = useState<Platform>(Platform.INSTAGRAM);
  const [selectedService, setSelectedService] = useState<string>('');
  
  // Dynamic Inputs State: Keys mapped to values
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  
  // Work Speed
  const [workSpeed, setWorkSpeed] = useState<SpeedOption>('FAST');

  const [quantity, setQuantity] = useState<number>(0);
  const [agreed, setAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sync with prop change (from HeroBanner)
  useEffect(() => {
    if (targetPlatform) {
      setPlatform(targetPlatform);
    }
  }, [targetPlatform]);

  // Filter services by platform
  const currentServices = SERVICE_OPTIONS.filter(s => s.platform === platform);
  
  // Get currently selected service object
  const currentServiceOption = SERVICE_OPTIONS.find(s => s.id === selectedService);

  // Default selection when platform changes
  useEffect(() => {
    if (currentServices.length > 0) {
      // If the current selection is not in the new platform, reset to first item
      if (!currentServices.find(s => s.id === selectedService)) {
        setSelectedService(currentServices[0].id);
        setQuantity(currentServices[0].minQuantity);
        setInputValues({}); // Reset inputs
      }
    }
  }, [platform, currentServices]);

  // Update quantity when service changes
  useEffect(() => {
    if (currentServiceOption) {
      setQuantity(currentServiceOption.minQuantity);
      setInputValues({}); // Clear inputs on service change
    }
  }, [selectedService]);

  // Calculate price
  const totalPrice = currentServiceOption ? quantity * currentServiceOption.pricePerUnit : 0;

  const handleInputChange = (key: string, value: string) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
  };

  const handlePayment = async () => {
    if (!currentServiceOption) return;

    // Validate Custom Inputs or Default URL
    if (currentServiceOption.inputs) {
      for (const input of currentServiceOption.inputs) {
        if (!inputValues[input.key]) {
          alert(`${input.label}을(를) 입력해주세요.`);
          return;
        }
      }
    } else {
      // Fallback for services without custom inputs (using 'url' key implicitly)
      if (!inputValues['url']) {
        alert('링크를 입력해주세요.');
        return;
      }
    }

    if (quantity < currentServiceOption.minQuantity) {
      alert(`최소 주문 수량은 ${currentServiceOption.minQuantity}개 입니다.`);
      return;
    }
    if (!agreed) {
      alert('이용약관에 동의해주세요.');
      return;
    }

    setIsProcessing(true);

    // Backend Interaction Simulation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save Order to LocalStorage
    const orders = JSON.parse(localStorage.getItem('site_orders') || '[]');
    orders.unshift({
        id: `ORD-${Date.now()}`,
        serviceName: currentServiceOption.name,
        amount: totalPrice,
        quantity: quantity,
        platform: platform,
        speed: workSpeed, // Log speed choice
        details: inputValues, // Log inputs
        date: new Date().toISOString()
    });
    localStorage.setItem('site_orders', JSON.stringify(orders));

    // Mock Success
    setTimeout(() => {
        setIsProcessing(false);
        setShowSuccessModal(true);
    }, 1000);
  };

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case Platform.YOUTUBE: return <i className="fa-brands fa-youtube text-red-500"></i>;
      case Platform.INSTAGRAM: return <i className="fa-brands fa-instagram text-pink-500"></i>;
      case Platform.NAVER: return <span className="font-bold text-green-500 text-xs border border-green-500 rounded px-1">N</span>;
      case Platform.DANGGEUN: return <i className="fa-solid fa-carrot text-orange-500"></i>;
    }
  };

  const tabs = [
    { key: Platform.INSTAGRAM, label: 'Instagram' },
    { key: Platform.YOUTUBE, label: 'YouTube' },
    { key: Platform.NAVER, label: 'Naver' },
    { key: Platform.DANGGEUN, label: 'Danggeun' },
  ];

  return (
    // Reduced max-width from 3xl to 2xl, reduced vertical padding
    <section id="order" className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-pink-100">
        <div className="bg-gradient-to-r from-primary to-primaryLight p-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-1">간편 주문하기</h2>
          <p className="opacity-90 text-sm">원하는 서비스를 선택하고 즉시 마케팅을 시작하세요.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setPlatform(tab.key)}
              className={`flex-1 py-3 px-2 font-bold text-base transition-colors flex items-center justify-center gap-2 min-w-[100px] ${
                platform === tab.key 
                ? 'text-primary bg-white border-b-2 border-primary' 
                : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {getPlatformIcon(tab.key)}
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Service Selector */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">서비스 선택</label>
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                }}
                className="w-full appearance-none border-2 border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white text-gray-800 font-medium transition-colors text-sm"
              >
                {currentServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} (개당 {service.pricePerUnit.toLocaleString()}원)
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
            {currentServiceOption && (
              <p className="mt-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <i className="fa-solid fa-circle-info mr-2 text-primary"></i>
                {currentServiceOption.description}
              </p>
            )}
          </div>

          {/* Dynamic Inputs */}
          {currentServiceOption && (currentServiceOption.inputs || [{ key: 'url', label: '링크(URL) 입력', type: 'text', placeholder: 'https://...' }]).map((input) => (
            <div key={input.key}>
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                {input.label}
              </label>
              {input.type === 'textarea' ? (
                <textarea
                  value={inputValues[input.key] || ''}
                  onChange={(e) => handleInputChange(input.key, e.target.value)}
                  placeholder={input.placeholder}
                  className="w-full border-2 border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm h-24 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={inputValues[input.key] || ''}
                  onChange={(e) => handleInputChange(input.key, e.target.value)}
                  placeholder={input.placeholder}
                  className="w-full border-2 border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                />
              )}
            </div>
          ))}

          {/* Quantity Input */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              수량 <span className="text-xs font-normal text-gray-500">(최소 {currentServiceOption?.minQuantity}개)</span>
            </label>
            <input
              type="number"
              value={quantity}
              min={currentServiceOption?.minQuantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border-2 border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
            />
          </div>

          {/* Work Speed Selector */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">작업 속도</label>
            <div className="flex gap-2">
              {[
                { val: 'FAST', label: '1일 이내' },
                { val: 'NORMAL', label: '1~3일' },
                { val: 'ANY', label: '상관없음' }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setWorkSpeed(opt.val as SpeedOption)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                    workSpeed === opt.val 
                    ? 'border-primary bg-pink-50 text-primary' 
                    : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Calculation */}
          <div className="bg-primaryBg rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-gray-600 font-medium text-xs">
              <p>선택 서비스: <span className="text-dark font-bold">{currentServiceOption?.name}</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">총 결제 금액</p>
              <p className="text-2xl font-extrabold text-primary">
                {totalPrice.toLocaleString()}원
              </p>
            </div>
          </div>

          {/* Agreement & Submit */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" 
              />
              <span className="text-gray-600 text-xs">
                서비스 시작 후에는 취소/환불이 불가함을 확인했습니다.
              </span>
            </label>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-2xl text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primaryLight hover:shadow-xl'
              }`}
            >
              {isProcessing ? '처리중...' : '결제하기'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}></div>
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md relative z-10 text-center shadow-2xl animate-bounce-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-check text-2xl text-green-500"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">주문이 완료되었습니다!</h3>
            <p className="text-gray-600 mb-6">
              주문하신 서비스가 곧 시작됩니다.<br/>
              주문번호: ORD-{Math.floor(Math.random() * 1000000)}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">서비스</span>
                <span className="font-bold text-gray-800 text-sm text-right w-40 truncate">{currentServiceOption?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">수량</span>
                <span className="font-bold text-gray-800">{quantity.toLocaleString()}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">작업속도</span>
                <span className="font-bold text-gray-800">
                    {workSpeed === 'FAST' && '1일 이내'}
                    {workSpeed === 'NORMAL' && '1~3일'}
                    {workSpeed === 'ANY' && '상관없음'}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-500">결제금액</span>
                <span className="font-bold text-primary">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-dark text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderForm;