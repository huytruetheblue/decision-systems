import { MainLayout } from "@/layout/mainLayout";
import { ModalProvider } from "@/provider/modalProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <ModalProvider />
      {children}
    </MainLayout>
  );
}
