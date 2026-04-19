import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {

  const { user, setUser,  } = useAuth();
const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      setUser(null); // clear state

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-md rounded-2xl border border-gray-200 p-8">
        
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          User Profile
        </h2>

        {/* Profile Info */}
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Name</span>
            <span className="text-gray-800">{user?.name || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="text-gray-800">{user?.email || "—"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500 font-medium">Role</span>
            <span className="text-gray-800 capitalize">
              {user?.role || "—"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex gap-4 justify-center text-center">
          <button onClick={handleLogout} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Logout
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
}