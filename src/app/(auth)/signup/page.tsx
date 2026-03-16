'use client';

import { Card, CardBody, CardHeader } from '@/components/ui';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const DEPARTMENTS = [
  '컴퓨터공학과',
  '전자공학과',
  '기계공학과',
  '화학공학과',
  '신소재공학과',
  '건축학과',
  '토목공학과',
  '산업공학과',
  '물리학과',
  '화학과',
  '생물학과',
  '수학과',
  '통계학과',
  '경영학과',
  '경제학과',
  '금융학과',
  '회계학과',
  '법학과',
  '국어국문학과',
  '영어영문학과',
];

const GRADES = [
  { value: 1, label: '1학년' },
  { value: 2, label: '2학년' },
  { value: 3, label: '3학년' },
  { value: 4, label: '4학년' },
  { value: 5, label: '대학원' },
];

export default function SignupPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [department, setDepartment] = useState('');
  const [grade, setGrade] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nicknameCheckLoading, setNicknameCheckLoading] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(value);
  };

  const checkNickname = async () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요');
      return;
    }

    if (nickname.length < 2 || nickname.length > 10) {
      setError('닉네임은 2~10자여야 합니다');
      return;
    }

    setNicknameCheckLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/check-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();

      if (response.ok) {
        setNicknameAvailable(true);
      } else {
        setNicknameAvailable(false);
        setError(data.message || '사용 불가능한 닉네임입니다');
      }
    } catch (err) {
      setError('닉네임 확인 중 오류가 발생했습니다');
    } finally {
      setNicknameCheckLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요');
      return;
    }

    if (nicknameAvailable !== true) {
      setError('닉네임 중복 확인을 해주세요');
      return;
    }

    if (pin.length !== 4) {
      setError('비밀번호는 4자리 숫자입니다');
      return;
    }

    if (!department) {
      setError('학과를 선택해주세요');
      return;
    }

    if (!grade) {
      setError('학년을 선택해주세요');
      return;
    }

    setIsLoading(true);

    try {
      // 회원가입 API 호출
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          pin,
          department,
          grade: parseInt(grade),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || '회원가입에 실패했습니다');
        return;
      }

      setSuccess(true);

      // 자동 로그인
      const loginResult = await signIn('credentials', {
        nickname,
        pin,
        redirect: false,
      });

      if (loginResult?.ok) {
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background flex items-center justify-center px-4 py-8">
      <Card variant="form" className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">UniSurvey</h1>
          <h2 className="text-xl font-semibold text-gray-900">회원가입</h2>
          <p className="text-gray-600 text-sm mt-2">
            새 계정을 만들어보세요
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임 (2~10자)
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="닉네임 입력"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameAvailable(null);
                  }}
                  disabled={isLoading}
                  fullWidth
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={checkNickname}
                  disabled={!nickname.trim() || nicknameCheckLoading || isLoading}
                  isLoading={nicknameCheckLoading}
                  className="flex-shrink-0"
                >
                  확인
                </Button>
              </div>
              {nicknameAvailable === true && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  사용 가능한 닉네임입니다
                </p>
              )}
              {nicknameAvailable === false && (
                <p className="text-red-600 text-sm mt-1">
                  사용 불가능한 닉네임입니다
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 (4자리 숫자)
              </label>
              <div className="flex gap-3 justify-center">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={pin[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value) {
                        const newPin = pin.split('');
                        newPin[index] = value;
                        setPin(newPin.join('').slice(0, 4));

                        // 다음 칸으로 자동 포커스 이동
                        if (index < 3) {
                          const nextInput = (e.target as HTMLInputElement).parentElement?.children[index + 1] as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      // 백스페이스 처리
                      if (e.key === 'Backspace' && !pin[index] && index > 0) {
                        const prevInput = (e.target as HTMLInputElement).parentElement?.children[index - 1] as HTMLInputElement;
                        prevInput?.focus();
                      }
                    }}
                    disabled={isLoading}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all disabled:bg-gray-100 sm:w-14"
                    placeholder="•"
                  />
                ))}
              </div>
            </div>

            {/* 학과 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                학과
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900 disabled:bg-gray-100"
              >
                <option value="">학과를 선택하세요</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* 학년 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                학년
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900 disabled:bg-gray-100"
              >
                <option value="">학년을 선택하세요</option>
                {GRADES.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* 가입하기 버튼 */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={
                isLoading ||
                !nickname.trim() ||
                nicknameAvailable !== true ||
                pin.length !== 4 ||
                !department ||
                !grade
              }
              isLoading={isLoading}
            >
              가입하기
            </Button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm mb-2">이미 계정이 있으신가요?</p>
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              로그인
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
