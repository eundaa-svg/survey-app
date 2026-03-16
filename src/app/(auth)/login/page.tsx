'use client';

import { Card, CardBody, CardHeader } from '@/components/ui';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading, login } = useAuth();
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요');
      return;
    }

    if (pin.length !== 4) {
      setError('비밀번호는 4자리 숫자입니다');
      return;
    }

    setIsSubmitting(true);

    const success = login(nickname, pin);

    if (success) {
      router.replace('/');
    } else {
      setError('닉네임 또는 비밀번호가 일치하지 않습니다');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background flex items-center justify-center px-4 py-8">
      <Card variant="form" className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">UniSurvey</h1>
          <h2 className="text-xl font-semibold text-gray-900">로그인</h2>
          <p className="text-gray-600 text-sm mt-2">
            닉네임과 비밀번호로 로그인하세요
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="닉네임"
                type="text"
                placeholder="닉네임 입력"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                fullWidth
                autoComplete="username"
              />
            </div>

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
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all sm:w-14"
                  />
                ))}
              </div>
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
              isLoading={isSubmitting}
              disabled={isSubmitting || pin.length !== 4}
              className="flex items-center justify-center"
            >
              <Lock size={18} />
              로그인
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm mb-2">계정이 없으신가요?</p>
            <Link
              href="/signup"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              가입하기
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
