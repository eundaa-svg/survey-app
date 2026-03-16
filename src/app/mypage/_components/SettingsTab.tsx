'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { User } from '@/providers/AuthProvider';
import { useToast } from '@/stores/toastStore';

const BANKS = [
  '카카오뱅크', '국민', '신한', '우리', '하나',
  '농협', '기업', 'SC제일', '대구', '부산', '토스뱅크',
];

export default function SettingsTab({ user }: { user: User }) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');

  // 계좌 정보
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holder, setHolder] = useState('');

  useEffect(() => {
    const cu = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (cu.bankInfo) {
      setBank(cu.bankInfo.bank || '');
      setAccountNumber(cu.bankInfo.accountNumber || '');
      setHolder(cu.bankInfo.holder || '');
    }
  }, []);

  const handleSaveBankInfo = () => {
    if (!bank) { showError('은행을 선택해주세요'); return; }
    if (!accountNumber.trim()) { showError('계좌번호를 입력해주세요'); return; }
    if (!holder.trim()) { showError('예금주를 입력해주세요'); return; }

    const cu = JSON.parse(localStorage.getItem('currentUser') || '{}');
    cu.bankInfo = { bank, accountNumber: accountNumber.trim(), holder: holder.trim() };
    localStorage.setItem('currentUser', JSON.stringify(cu));
    success('계좌가 등록되었습니다');
  };

  const handleDeleteAccount = () => {
    if (deleteCode !== 'delete') {
      showError('정확히 입력해주세요');
      return;
    }
    localStorage.removeItem('currentUser');
    success('계정이 삭제되었습니다');
    window.location.href = '/login';
  };

  return (
    <div className="space-y-6">
      {/* 프로필 정보 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">프로필 정보</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-0">
            <div className="flex items-center gap-4 py-4 border-b border-gray-200">
              <label className="w-24 font-medium text-gray-700 flex-shrink-0">닉네임</label>
              <p className="flex-1 text-gray-900">{user.nickname}</p>
            </div>
            <div className="flex items-center gap-4 py-4 border-b border-gray-200">
              <label className="w-24 font-medium text-gray-700 flex-shrink-0">학과</label>
              <p className="flex-1 text-gray-900">{user.department}</p>
            </div>
            <div className="flex items-center gap-4 py-4">
              <label className="w-24 font-medium text-gray-700 flex-shrink-0">학년</label>
              <p className="flex-1 text-gray-900">{user.grade}학년</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 출금 계좌 정보 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">출금 계좌 정보</h3>
          <p className="text-sm text-gray-500 mt-1">포인트 출금 시 사용할 계좌를 등록해주세요</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">은행</label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            >
              <option value="">은행 선택</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="계좌번호 입력 (- 없이)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예금주</label>
            <input
              type="text"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              placeholder="예금주 이름"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button variant="primary" fullWidth onClick={handleSaveBankInfo}>
            계좌 저장
          </Button>
        </CardBody>
      </Card>

      {/* 계정 삭제 */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <h3 className="text-lg font-semibold text-red-900">계정 삭제</h3>
          <p className="text-sm text-red-700 mt-1">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다
          </p>
        </CardHeader>
        <CardBody>
          <Button variant="danger" fullWidth onClick={() => setDeleteConfirm(true)}>
            계정 삭제하기
          </Button>
        </CardBody>
      </Card>

      {/* 계정 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirm}
        onClose={() => { setDeleteConfirm(false); setDeleteCode(''); }}
        title="계정 삭제 확인"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            이 작업은 되돌릴 수 없습니다. 계정과 모든 관련 데이터가 영구적으로 삭제됩니다.
          </p>
          <p className="text-gray-700 font-medium">
            아래에 &quot;<span className="text-red-600">delete</span>&quot;를 입력하여 확인해주세요.
          </p>
          <input
            type="text"
            value={deleteCode}
            onChange={(e) => setDeleteCode(e.target.value)}
            placeholder="delete"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => { setDeleteConfirm(false); setDeleteCode(''); }}>
              취소
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} disabled={deleteCode !== 'delete'}>
              계정 삭제
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
