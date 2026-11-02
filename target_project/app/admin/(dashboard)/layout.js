import AdminHeader from '@/components/AdminHeader'
import Footer from '@/components/Footer'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AdminHeader />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">{children}</main>
      <Footer />
    </div>
  )
}
