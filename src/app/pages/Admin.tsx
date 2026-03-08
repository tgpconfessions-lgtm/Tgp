import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Confession {
  id: string;
  name: string;
  confession: string;
  timestamp: string;
  reviewed: boolean;
}

export default function Admin() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return null;
    }
    return token;
  };

  const fetchConfessions = async () => {
    const token = checkAuth();
    if (!token) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-521197c9/api/admin/confessions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Token": token,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      if (response.ok && data.success) {
        setConfessions(data.confessions);
      } else {
        console.error("Error fetching confessions:", data.error);
        setError("Failed to load confessions");
      }
    } catch (error) {
      console.error("Error fetching confessions:", error);
      setError("Failed to load confessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  const handleDelete = async (confessionId: string) => {
    const token = checkAuth();
    if (!token) return;

    if (!confirm("Are you sure you want to delete this confession?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-521197c9/api/admin/confessions/${confessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Token": token,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setConfessions(prev => prev.filter(c => c.id !== confessionId));
      } else {
        alert("Failed to delete confession");
      }
    } catch (error) {
      console.error("Error deleting confession:", error);
      alert("Failed to delete confession");
    }
  };

  const handleToggleReview = async (confessionId: string) => {
    const token = checkAuth();
    if (!token) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-521197c9/api/admin/confessions/${confessionId}/review`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Admin-Token": token,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setConfessions(prev =>
          prev.map(c =>
            c.id === confessionId ? { ...c, reviewed: data.reviewed } : c
          )
        );
      } else {
        alert("Failed to update review status");
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      alert("Failed to update review status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#0f172a' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#ffffff' }}>
              Admin Dashboard
            </h1>
            <p className="text-lg" style={{ color: '#94a3b8' }}>
              View and manage all confessions
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
            >
              ← Home
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <p style={{ color: '#94a3b8' }}>Loading confessions...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4 px-6 rounded-lg mb-6" style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>
            {error}
          </div>
        )}

        {!isLoading && !error && confessions.length === 0 && (
          <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: '#1e293b' }}>
            <p style={{ color: '#94a3b8' }}>No confessions yet</p>
          </div>
        )}

        {!isLoading && confessions.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p style={{ color: '#94a3b8' }}>
                Total confessions: <span style={{ color: '#ffffff', fontWeight: 600 }}>{confessions.length}</span>
              </p>
              <button
                onClick={fetchConfessions}
                className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: '#ff2e63', color: '#ffffff' }}
              >
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {confessions.map((confession) => (
                <div
                  key={confession.id}
                  className="rounded-xl p-6"
                  style={{ 
                    backgroundColor: '#1e293b', 
                    border: `2px solid ${confession.reviewed ? '#10b981' : '#334155'}` 
                  }}
                >
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-lg" style={{ color: '#ffffff' }}>
                          {confession.name || "Anonymous"}
                        </p>
                        {confession.reviewed && (
                          <span 
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{ backgroundColor: '#10b981', color: '#ffffff' }}
                          >
                            Reviewed
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: '#64748b' }}>
                        {formatDate(confession.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleReview(confession.id)}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                        style={{ 
                          backgroundColor: confession.reviewed ? '#64748b' : '#10b981',
                          color: '#ffffff' 
                        }}
                      >
                        {confession.reviewed ? "Unmark" : "Mark Reviewed"}
                      </button>
                      <button
                        onClick={() => handleDelete(confession.id)}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                        style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: '#0f172a' }}>
                    <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                      {confession.confession}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}