import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function Home() {
  const [name, setName] = useState("");
  const [confession, setConfession] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({ totalConfessions: 0, totalVisitors: 0 });

  // Track visitor and fetch stats on mount
  useEffect(() => {
    const trackVisitorAndFetchStats = async () => {
      try {
        // Track visitor
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-521197c9/api/track-visitor`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        // Fetch stats
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-521197c9/api/stats`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setStats({
            totalConfessions: data.totalConfessions,
            totalVisitors: data.totalVisitors,
          });
        }
      } catch (error) {
        console.error("Error tracking visitor or fetching stats:", error);
      }
    };

    trackVisitorAndFetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confession.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-521197c9/api/confess`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            confession: confession.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setName("");
        setConfession("");
        
        // Update confession count
        setStats(prev => ({
          ...prev,
          totalConfessions: prev.totalConfessions + 1,
        }));
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        console.error("Error submitting confession:", data.error);
        alert("Failed to submit confession. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting confession:", error);
      alert("Failed to submit confession. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0f172a' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#ffffff' }}>
            TGP Confessions
          </h1>
          <p className="text-lg md:text-xl" style={{ color: '#94a3b8' }}>
            Share your confession anonymously
          </p>
        </div>

        <div className="rounded-2xl p-6 md:p-8 mb-6" style={{ backgroundColor: '#1e293b' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm mb-2" style={{ color: '#94a3b8' }}>
                Name (Only visible to admin)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-3 rounded-lg outline-none transition-all focus:ring-2"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                }}
              />
            </div>

            <div>
              <label htmlFor="confession" className="block text-sm mb-2" style={{ color: '#94a3b8' }}>
                Write your confession
              </label>
              <textarea
                id="confession"
                value={confession}
                onChange={(e) => setConfession(e.target.value)}
                placeholder="Write your confession here..."
                rows={8}
                required
                className="w-full px-4 py-3 rounded-lg outline-none transition-all focus:ring-2 resize-none"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !confession.trim()}
              className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#ff2e63' }}
            >
              {isSubmitting ? "Submitting..." : "Submit Confession"}
            </button>

            {successMessage && (
              <div className="text-center py-3 px-4 rounded-lg" style={{ backgroundColor: '#10b981', color: '#ffffff' }}>
                {successMessage}
              </div>
            )}
          </form>
        </div>

        {/* Statistics Section */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#1e293b' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#ff2e63' }}>
                {stats.totalConfessions}
              </p>
              <p className="text-sm md:text-base" style={{ color: '#94a3b8' }}>
                Total Confessions Submitted
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#ff2e63' }}>
                {stats.totalVisitors}
              </p>
              <p className="text-sm md:text-base" style={{ color: '#94a3b8' }}>
                Total Visitors
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}