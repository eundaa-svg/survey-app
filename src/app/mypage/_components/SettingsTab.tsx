'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button, Input } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/stores/toastStore';

interface UserProfile {
  id: string;
  nickname: string;
  department: string;
  grade: number;
  points: number;
  interests: string;
}

export default function SettingsTab() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteCode, setDeleteCode] = useState('');

  const [formData, setFormData] = useState({
    nickname: '',
    department: '',
    grade: '',
    interests: [] as string[],
  });

  const categories = [
    { value: 'ACADEMIC', label: '학술' },
    { value: 'RESEARCH', label: '연구' },
    { value: 'CAMPUS', label: '캠퍼스' },
    { value: 'OTHER', label: '기타' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/me/profile');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (!response.ok) throw new Error('프로필 조회 실패');
      const profileData = await response.json();
      setProfile(profileData);
      setFormData({
        nickname: profileData.nickname,
        department: profileData.department,
        grade: profileData.grade.toString(),
        interests: profileData.interests ? JSON.parse(profileData.interests) : [],
      });
    } catch (err) {
      showError('프로필을 불러올 수 없습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/users/me/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('프로필 업데이트 실패');
      success('프로필이 저장되었습니다');
      const updated = await response.json();
      setProfile(updated);
    } catch (err) {
      showError('프로필 저장 중 오류가 발생했습니다');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteCode !== 'delete') {
      showError('정확히 입력해주세요');
      return;
    }
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('계정 삭제 실패');
      success('계정이 삭제되었습니다');
      router.push('/');
    } catch (err) {
      showError('계정 삭제 중 오류가 발생했습니다');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
        <p className="text-gray-500 mt-4">로딩 중...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500">프로필을 불러올 수 없습니다</p>
      </div>
    );
  }

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
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              />
            </div>

            <div className="flex items-center gap-4 py-4 border-b border-gray-200">
              <label className="w-24 font-medium text-gray-700 flex-shrink-0">학과</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              />
            </div>

            <div className="flex items-center gap-4 py-4 border-b border-gray-200">
              <label className="w-24 font-medium text-gray-700 flex-shrink-0">학년</label>
              <select
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              >
                <option value="">선택하세요</option>
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <option key={g} value={g}>
                    {g}학년
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              isLoading={saving}
              disabled={saving}
            >
              프로필 수정
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 관심 카테고리 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">관심 카테고리</h3>
          <p className="text-sm text-gray-600 mt-1">여러 개를 선택할 수 있습니다</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <label
                key={cat.value}
                className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.interests.includes(cat.value)}
                  onChange={() => handleInterestToggle(cat.value)}
                  className="rounded w-4 h-4 text-primary-600 cursor-pointer"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">{cat.label}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              isLoading={saving}
              disabled={saving}
            >
              저장
            </Button>
          </div>
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
          <Button
            variant="danger"
            fullWidth
            onClick={() => setDeleteConfirm(true)}
          >
            계정 삭제하기
          </Button>
        </CardBody>
      </Card>

      {/* 계정 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirm}
        onClose={() => {
          setDeleteConfirm(false);
          setDeleteCode('');
        }}
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
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteConfirm(false);
                setDeleteCode('');
              }}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deleteCode !== 'delete'}
            >
              계정 삭제
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
