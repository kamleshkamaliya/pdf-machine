// Yahan hum relative path use kar rahe hain taaki koi confusion na ho
import LogoutButton from "./_components/LogoutButton"; 

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-800 text-lg">PDF Machine Admin</span>
          <div className="h-6 w-[1px] bg-gray-300"></div>
          <a href="/admin/posts" className="text-gray-600 hover:text-blue-600 text-sm">All Posts</a>
        </div>
        
        <LogoutButton />
      </nav>

      {/* Page Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}