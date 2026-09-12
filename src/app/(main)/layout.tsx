import { LogoutButton } from "@/components/auth/LogoutButton";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <LogoutButton />
      </div>
      {children}
    </>
  );
}
