import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AdminAuthProvider } from "@/components/admin/AdminAuth";
import "@/styles/admin.css";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Golden Fresh" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
      <Toaster theme="dark" position="bottom-right" richColors />
    </AdminAuthProvider>
  );
}
