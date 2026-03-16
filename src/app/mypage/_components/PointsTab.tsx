'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { X } from 'lucide-react';
import { User } from '@/providers/AuthProvider';

interface PointRecord {
  id: string;
  type: 'earn' | 'withdraw';
  amount: number;
  fee?: number;
  netAmount?: number;
  surveyId?: string;
  surveyTitle?: string;
  status?: string;
  date: string;
}

interface BankInfo {
  bank: string;
  accountNumber: string;
  holder: string;
}

interface WithdrawalResult {
  amount: number;
  fee: number;
  netAmount: number;
  bank: string;
  accountNumber: string;
}

export default function PointsTab({
  user,
  onTabChange,
}: {
  user: User;
  onTabChange?: (tab: string) => void;
}) {
  const [points, setPoints] = useState(user.points || 0);
  const [history, setHistory] = useState<PointRecord[]>([]);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [lastWithdrawal, setLastWithdrawal] = useState<WithdrawalResult | null>(null);

  const loadData = () => {
    const cu = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setPoints(cu.points || 0);
    if (cu.bankInfo) setBankInfo(cu.bankInfo);

    const records: PointRecord[] = JSON.parse(localStorage.getItem('unisurvey_points') || '[]');
    const surveys: any[] = JSON.parse(localStorage.getItem('unisurvey_surveys') || '[]');
    const surveyMap = Object.fromEntries(surveys.map((s) => [s.id, s]));

    const enriched = records.map((r) => ({
      ...r,
      surveyTitle:
        r.surveyTitle ||
        (r.surveyId ? surveyMap[r.surveyId]?.title : '') ||
        (r.type === 'withdraw' ? '포인트 출금' : '설문'),
      amount: r.amount || 0,
    }));
    setHistory(enriched);
  };

  useEffect(() => { loadData(); }, []);

  const fee = Math.round((parseInt(withdrawAmount) || 0) * 0.033);
  const netAmount = (parseInt(withdrawAmount) || 0) - fee;

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    setWithdrawError('');

    if (!bankInfo) {
      setWithdrawError('출금 계좌를 먼저 등록해주세요');
      return;
    }
    if (!amount || amount < 1000) {
      setWithdrawError('최소 출금 금액은 1,000P입니다');
      return;
    }
    if (amount > points) {
      setWithdrawError('보유 포인트가 부족합니다');
      return;
    }

    const calcFee = Math.round(amount * 0.033);
    const calcNet = amount - calcFee;

    // 포인트 차감
    const cu = JSON.parse(localStorage.getItem('currentUser') || '{}');
    cu.points = (cu.points || 0) - amount;
    localStorage.setItem('currentUser', JSON.stringify(cu));

    // 출금 내역
    const withdrawals = JSON.parse(localStorage.getItem('unisurvey_withdrawals') || '[]');
    withdrawals.unshift({
      id: 'withdraw_' + Date.now(),
      amount,
      fee: calcFee,
      netAmount: calcNet,
      bank: bankInfo.bank,
      accountNumber: bankInfo.accountNumber,
      holder: bankInfo.holder,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('unisurvey_withdrawals', JSON.stringify(withdrawals));

    // 포인트 내역에 출금 기록
    const pointHistory = JSON.parse(localStorage.getItem('unisurvey_points') || '[]');
    pointHistory.unshift({
      id: 'point_' + Date.now(),
      type: 'withdraw',
      amount: -amount,
      fee: calcFee,
      netAmount: calcNet,
      surveyTitle: '포인트 출금',
      status: 'pending',
      date: new Date().toISOString(),
    });
    localStorage.setItem('unisurvey_points', JSON.stringify(pointHistory));

    setLastWithdrawal({
      amount,
      fee: calcFee,
      netAmount: calcNet,
      bank: bankInfo.bank,
      accountNumber: bankInfo.accountNumber,
    });

    loadData();
    setShowWithdraw(false);
    setWithdrawAmount('');
    setWithdrawError('');
    setShowSuccess(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* 포인트 잔액 */}
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardBody className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">보유 포인트</p>
                <p className="text-5xl font-bold mt-2">{points.toLocaleString()}P</p>
              </div>
              <button
                onClick={() => { setWithdrawError(''); setWithdrawAmount(''); setShowWithdraw(true); }}
                className="bg-white text-primary-600 font-bold px-5 py-2.5 rounded-full text-sm hover:bg-primary-50 transition-colors flex-shrink-0"
              >
                출금하기
              </button>
            </div>
          </CardBody>
        </Card>

        {/* 포인트 내역 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">포인트 내역</h3>
          </CardHeader>
          <CardBody>
            {history.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">아직 포인트 내역이 없습니다</p>
            ) : (
              <div className="space-y-0">
                {history.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900">{record.surveyTitle}</p>
                        {record.type === 'withdraw' && record.status === 'pending' && (
                          <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                            입금 예정
                          </span>
                        )}
                      </div>
                      {record.type === 'withdraw' && record.fee !== undefined && (
                        <p className="text-xs text-gray-400 mt-0.5">수수료 {record.fee.toLocaleString()}원</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(record.date).toLocaleDateString('ko-KR', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-bold ml-4 flex-shrink-0 ${
                        record.type === 'withdraw' ? 'text-red-500' : 'text-green-600'
                      }`}
                    >
                      {record.type === 'withdraw' ? '' : '+'}
                      {Math.abs(record.amount).toLocaleString()}P
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* 출금 모달 */}
      {showWithdraw && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => setShowWithdraw(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">포인트 출금</h2>
              <button onClick={() => setShowWithdraw(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* 보유 포인트 */}
              <div className="bg-primary-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">보유 포인트</span>
                <span className="text-xl font-bold text-primary-600">{points.toLocaleString()}P</span>
              </div>

              {/* 출금 금액 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출금 금액 (최소 1,000P)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => { setWithdrawAmount(e.target.value); setWithdrawError(''); }}
                    placeholder="출금할 포인트 입력"
                    min={1000}
                    max={points}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={() => setWithdrawAmount(String(points))}
                    className="px-3 py-2 text-sm border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 whitespace-nowrap"
                  >
                    전액 출금
                  </button>
                </div>
                {withdrawError && (
                  <p className="text-red-500 text-sm mt-1">{withdrawError}</p>
                )}
              </div>

              {/* 수수료 계산 */}
              {parseInt(withdrawAmount) > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">출금 금액</span>
                    <span className="font-medium">{(parseInt(withdrawAmount) || 0).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <span>수수료 (3.3%)</span>
                    <span>-{fee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                    <span className="text-gray-900">실 입금액</span>
                    <span className="text-primary-600">{netAmount.toLocaleString()}원</span>
                  </div>
                </div>
              )}

              {/* 입금 계좌 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">입금 계좌</p>
                {bankInfo ? (
                  <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900">
                    {bankInfo.bank} {bankInfo.accountNumber} ({bankInfo.holder})
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm">
                    <p className="text-orange-700 mb-1">출금 계좌를 먼저 등록해주세요</p>
                    <button
                      onClick={() => { setShowWithdraw(false); onTabChange?.('settings'); }}
                      className="text-primary-600 font-medium underline"
                    >
                      계좌 등록하기
                    </button>
                  </div>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600"
                >
                  출금 신청
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {showSuccess && lastWithdrawal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-6 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">출금 신청이 완료되었습니다!</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">입금 예정액</span>
                <span className="font-bold text-primary-600">{lastWithdrawal.netAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">수수료</span>
                <span className="text-red-500">-{lastWithdrawal.fee.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">입금 계좌</span>
                <span>{lastWithdrawal.bank} {lastWithdrawal.accountNumber}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">영업일 기준 1~3일 내 입금됩니다</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
