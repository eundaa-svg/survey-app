'use client';

import { Card, CardBody, CardHeader } from '@/components/ui';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const UNIVERSITIES = [
  '국민대학교', '서울대학교', '연세대학교', '고려대학교', '성균관대학교',
  '한양대학교', '중앙대학교', '경희대학교', '건국대학교', '동국대학교',
  '홍익대학교', '숭실대학교', '세종대학교', '광운대학교', '상명대학교',
  '한성대학교', '서울시립대학교', '기타',
];

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
  const { isLoggedIn, isLoading, register } = useAuth();
  const [university, setUniversity] = useState('');
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [department, setDepartment] = useState('');
  const [grade, setGrade] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nicknameCheckLoading, setNicknameCheckLoading] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace('/');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return null;
  }

  if (isLoggedIn) {
    return null;
  }

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  };

  const validatePhoneNumber = (value: string): boolean => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned.startsWith('010');
  };

  const checkNickname = () => {
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
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : {};

      const isDuplicate = Object.values(users).some((u: any) => u.nickname === nickname);

      if (isDuplicate) {
        setNicknameAvailable(false);
        setNicknameCheckMessage('이미 사용 중인 닉네임입니다');
      } else {
        setNicknameAvailable(true);
        setNicknameCheckMessage('사용 가능한 닉네임입니다');
      }
    } catch (err) {
      setError('닉네임 확인 중 오류가 발생했습니다');
    } finally {
      setNicknameCheckLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사
    if (!university) {
      setError('대학교를 선택해주세요');
      return;
    }

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

    if (!phone.trim()) {
      setError('전화번호를 입력해주세요');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setError('올바른 전화번호를 입력해주세요');
      return;
    }

    setIsSubmitting(true);

    const success = register(nickname, pin, department, parseInt(grade), university, phone);

    if (success) {
      setSuccess(true);
      router.replace('/');
    } else {
      setError('회원가입에 실패했습니다');
      setIsSubmitting(false);
    }
  };

  const isSignupButtonDisabled =
    isSubmitting ||
    !university ||
    !nickname.trim() ||
    nicknameAvailable !== true ||
    pin.length !== 4 ||
    !department ||
    !grade ||
    !validatePhoneNumber(phone);

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
            {/* 대학교 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대학교
              </label>
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900 disabled:bg-gray-100"
              >
                <option value="">대학교를 선택하세요</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임 (2~10자)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="닉네임 입력"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameAvailable(null);
                    setNicknameCheckMessage(null);
                  }}
                  disabled={isSubmitting}
                  className={`flex-1 px-3 py-2.5 border-2 rounded-lg outline-none transition-all text-gray-900 disabled:bg-gray-100 focus:ring-2 ${
                    nicknameAvailable === true
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
                      : nicknameAvailable === false
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                  }`}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={checkNickname}
                  disabled={!nickname.trim() || nicknameCheckLoading || isSubmitting}
                  isLoading={nicknameCheckLoading}
                  className="flex-shrink-0"
                >
                  확인
                </Button>
              </div>
              {nicknameCheckMessage && (
                <p
                  className={`text-sm mt-1 flex items-center gap-1 ${
                    nicknameAvailable === true ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {nicknameAvailable === true && <CheckCircle2 size={14} />}
                  {nicknameCheckMessage}
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
                      // 백스페이스 또는 Delete 처리
                      if (e.key === 'Backspace' || e.key === 'Delete') {
                        e.preventDefault();
                        if (pin[index]) {
                          // 현재 칸에 값이 있으면 삭제
                          const newPin = pin.split('');
                          newPin[index] = '';
                          setPin(newPin.join('').slice(0, 4));
                        } else if (index > 0) {
                          // 현재 칸이 비어있으면 이전 칸으로 이동하고 그 칸 값 삭제
                          const prevInput = (e.target as HTMLInputElement).parentElement?.children[index - 1] as HTMLInputElement;
                          const newPin = pin.split('');
                          newPin[index - 1] = '';
                          setPin(newPin.join('').slice(0, 4));
                          prevInput?.focus();
                        }
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all disabled:bg-gray-100 sm:w-14"
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

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              <input
                type="text"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                disabled={isSubmitting}
                maxLength={13}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-900 disabled:bg-gray-100"
              />
              {phone && !validatePhoneNumber(phone) && (
                <p className="text-sm text-red-600 mt-1">올바른 전화번호를 입력해주세요</p>
              )}
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* 가입하기 버튼 */}
            <div>
              {isSignupButtonDisabled && nicknameAvailable !== true && nickname.trim() && (
                <p className="text-sm text-gray-600 mb-2 text-center">
                  닉네임 중복 확인을 해주세요
                </p>
              )}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSignupButtonDisabled}
                isLoading={isSubmitting}
              >
                가입하기
              </Button>
            </div>
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
