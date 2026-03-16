import MainLayout from '@/components/layout/MainLayout';

export const metadata = {
  title: '메인 - UniSurvey',
  description: '설문을 찾고 참여하세요',
};

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
