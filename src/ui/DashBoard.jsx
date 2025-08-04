// pages/Dashboard.jsx
import { useUser } from "../features/auth/useUser";
import { useLogOut } from "../features/auth/useLogOut";

function Dashboard() {
  const { user } = useUser();
  const { logout, isPending } = useLogOut();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => logout()}
              disabled={isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? "Logging out..." : "Logout"}
            </button>
          </div>
          
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Welcome back!</h2>
            <p className="text-gray-600 mt-2">
              Email: <span className="font-medium">{user?.email}</span>
            </p>
            <p className="text-gray-600">
              User ID: <span className="font-medium">{user?.id}</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Stats 1</h3>
              <p className="text-2xl font-bold text-blue-600">42</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Stats 2</h3>
              <p className="text-2xl font-bold text-green-600">128</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Stats 3</h3>
              <p className="text-2xl font-bold text-purple-600">95%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;