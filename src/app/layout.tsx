import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import ToastContainer from "@/components/layout/ToastContainer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Providers from "@/components/Providers";
import AuthGuard from "@/components/layout/AuthGuard";

export const metadata: Metadata = {
  title: "설문조사 앱",
  description: "설문을 만들고 참여하고 결과를 확인하세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="h-screen overflow-hidden">
        <Providers>
          <ErrorBoundary>
            <AuthGuard>
              <Header />
              <Sidebar />
              <main className="fixed inset-0 top-16 lg:left-64 overflow-y-auto overflow-x-hidden pb-20 lg:pb-0">
                {children}
              </main>
              <BottomNav />
              <ToastContainer />
            </AuthGuard>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
