import { useState } from "react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-521197c9/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token in localStorage
        localStorage.setItem("adminToken", data.token);
        navigate("/admin");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0f172a' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#ffffff' }}>
            Admin Login
          </h1>
          <p className="text-base" style={{ color: '#94a3b8' }}>
            Access the admin dashboard
          </p>
        </div>

        <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: '#1e293b' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm mb-2" style={{ color: '#94a3b8' }}>
                Admin Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full px-4 py-3 rounded-lg outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2" style={{ color: '#94a3b8' }}>
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-3 rounded-lg outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                }}
              />
            </div>

            {error && (
              <div className="text-center py-3 px-4 rounded-lg" style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#ff2e63' }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm hover:underline"
              style={{ color: '#64748b' }}
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
