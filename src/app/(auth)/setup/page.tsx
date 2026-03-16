'use client';

import { Card, CardBody, CardHeader } from '@/components/ui';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';

const DEPARTMENTS = [
  '컴퓨터공학과',
  '소프트웨어학과',
  '전기전자공학과',
  '기계공학과',
  '화학공학과',
  '토목공학과',
  '건축학과',
  '경영학과',
  '경제학과',
  '회계학과',
  '영어영문학과',
  '한국어한문학과',
  '사학과',
  '철학과',
  '심리학과',
  '물리학과',
  '화학과',
  '생물학과',
  '수학과',
  '기타',
];

const GRADES = [1, 2, 3, 4, '대학원'];

export default function SetupPage() {
  const router = useRouter();
  const { update } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    department: '',
    grade: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    if (!formData.studentId.trim()) {
      setError('학번을 입력해주세요');
      return;
    }
    if (!formData.department) {
      setError('학과를 선택해주세요');
      return;
    }
    if (!formData.grade) {
      setError('학년을 선택해주세요');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/user/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          studentId: formData.studentId,
          department: formData.department,
          grade: formData.grade === '대학원' ? null : parseInt(formData.grade),
        }),
      });

      if (!res.ok) {
        throw new Error('프로필 저장에 실패했습니다');
      }

      setSuccess(true);

      // 세션 갱신 (JWT callback 재실행)
      await update();

      // 2초 후 홈으로 이동
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card variant="form" className="w-full max-w-md">
          <CardBody className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={32} className="text-success" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">프로필이 완성되었습니다!</h2>
            <p className="text-gray-600 text-sm">곧 메인 페이지로 이동합니다...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background flex items-center justify-center px-4 py-8">
      <Card variant="form" className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">프로필을 완성해주세요</h1>
          <p className="text-gray-600 text-sm mt-2">
            UniSurvey 서비스를 이용하기 위해 프로필 정보를 입력해주세요
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="이름"
              name="name"
              placeholder="홍길동"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />

            <Input
              label="학번"
              name="studentId"
              placeholder="20240001"
              value={formData.studentId}
              onChange={handleChange}
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">학과</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-700"
              >
                <option value="">선택해주세요</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">학년</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-700"
              >
                <option value="">선택해주세요</option>
                {GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {typeof grade === 'number' ? `${grade}학년` : grade}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              시작하기
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
