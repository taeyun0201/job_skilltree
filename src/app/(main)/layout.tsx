export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // TODO(auth): 실제 인증 연결 후 여기서 비로그인 사용자를 /login으로 보냅니다.
  return children;
}
