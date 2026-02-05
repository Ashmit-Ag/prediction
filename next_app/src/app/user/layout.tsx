import BottomNav from "@/components/user/BottomNav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#131313] text-white min-h-screen max-w-125 mx-auto">
      {children}
      <BottomNav />
    </div>
  );
}
