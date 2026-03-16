'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { User, useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/stores/toastStore';

const UNIVERSITIES = [
  '국민대학교', '서울대학교', '연세대학교', '고려대학교', '성균관대학교',
  '한양대학교', '중앙대학교', '경희대학교', '건국대학교', '동국대학교',
  '홍익대학교', '숭실대학교', '세종대학교', '광운대학교', '상명대학교',
  '한성대학교', '서울시립대학교', '기타',
];

const DEPARTMENTS = [
  '컴퓨터공학과', '정보통신학과', '전자공학과', '기계공학과', '건축학과',
  '경영학과', '경제학과', '국제통상학과', '회계학과', '법학과',
  '영문학과', '한문학과', '일문학과', '중문학과', '철학과',
  '심리학과', '사회학과', '기타',
];

const GRADES = [
  { label: '1학년', value: 1 },
  { label: '2학년', value: 2 },
  { label: '3학년', value: 3 },
  { label: '4학년', value: 4 },
  { label: '대학원', value: 5 },
];

const BANKS = [
  '카카오뱅크', '국민', '신한', '우리', '하나',
  '농협', '기업', 'SC제일', '대구', '부산', '토스뱅크',
];

export default function SettingsTab({ user }: { user: User }) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { setUser } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');

  // 프로필 편집 모드
  const [editingMode, setEditingMode] = useState(false);
  const [editUniversity, setEditUniversity] = useState(user.university || '');
  const [editDepartment, setEditDepartment] = useState(user.department || '');
  const [editGrade, setEditGrade] = useState(user.grade || 1);

  // 계좌 정보
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holder, setHolder] = useState('');

  useEffect(() => {
    const cu = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setEditUniversity(cu.university || '');
    setEditDepartment(cu.department || '');
    setEditGrade(cu.grade || 1);
    if (cu.bankInfo) {
      setBank(cu.bankInfo.bank || '');
      setAccountNumber(cu.bankInfo.accountNumber || '');
      setHolder(cu.bankInfo.holder || '');
    }
  }, []);

  const handleSaveProfile = () => {
    if (!editUniversity) { showError('대학교를 선택해주세요'); return; }
    if (!editDepartment) { showError('학과를 선택해주세요'); return; }

    const cu = JSON.parse(localStorage.getItem('currentUser') || '{}');
    cu.university = editUniversity;
    cu.department = editDepartment;
    cu.grade = editGrade;
    localStorage.setItem('currentUser', JSON.stringify(cu));

    // AuthProvider의 setUser로 즉시 반영 (헤더 업데이트)
    const updatedUser: User = {
      ...user,
      university: editUniversity,
      department: editDepartment,
      grade: editGrade,
    };
    setUser(updatedUser);

    setEditingMode(false);
    success('프로필이 수정되었습니다');
  };

  const handleCancelProfile = () => {
    setEditUniversity(user.university || '');
    setEditDepartment(user.department || '');
    setEditGrade(user.grade || 1);
    setEditingMode(false);
  };

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
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">프로필 정보</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-0">
            {/* 대학교 */}
            <div className="flex items-center gap-4 py-4 border-b border-gray-200">
              <label className="w-24 font-medium text-gray-700 flex-shrink-0">대학교</label>
              {editingMode ? (
                <select
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">선택</option>
                  {UNIVERSITIES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              ) : (
                <p className="flex-1 text-gray-900">{user.university || '미설정'}</p>
              )}
            </div>

            {/* 닉네임 */}
            <div className="flex items-center gap-4 py-4 border-b border-gray-200">
              <label className="w-24 font-medium text-gray-700 flex-shrink-0">닉네임</label>
              <div className="flex flex-1 items-center gap-2">
                <p className="text-gray-600">{user.nickname}</p>
                {editingMode && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">변경 불가</span>}
              </div>
            </div>

            {/* 학과 */}
            <div className="flex items-center gap-4 py-4 border-b border-gray-200">
              <label className="w-24 font-medium text-gray-700 flex-shrink-0">학과</label>
              {editingMode ? (
                <select
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">선택</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <p className="flex-1 text-gray-900">{user.department}</p>
              )}
            </div>

            {/* 학년 */}
            <div className="flex items-center gap-4 py-4 border-b border-gray-200">
              <label className="w-24 font-medium text-gray-700 flex-shrink-0">학년</label>
              {editingMode ? (
                <select
                  value={editGrade}
                  onChange={(e) => setEditGrade(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {GRADES.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              ) : (
                <p className="flex-1 text-gray-900">
                  {GRADES.find((g) => g.value === user.grade)?.label || `${user.grade}학년`}
                </p>
              )}
            </div>

            {/* 버튼 영역 */}
            <div className="pt-4 flex gap-2 justify-end">
              {editingMode ? (
                <>
                  <button
                    onClick={handleCancelProfile}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    저장
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingMode(true)}
                  className="px-6 py-2 border border-primary-500 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                >
                  수정
                </button>
              )}
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
