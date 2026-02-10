import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Tag, Clock, Upload } from "lucide-react";
import VideoBackground from "../components/background/VideoBackground";

const CreateTournament = ({ tournaments }) => {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [existingPhases, setExistingPhases] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchTags(), fetchExistingPhases()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Initialize empty tournament
    const template = {
      eventId: null,
      eventName: "New Tournament",
      eventDescription: "Describe your tournament here...",
      IconPath: null,
      organizer: { nickname: "You" },
      organizerName: "You",
      eventTags: [],
    };
    setTournament(JSON.parse(JSON.stringify(template)));
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/event/tags");
      if (response.ok) {
        const data = await response.json();
        setAllTags(Array.isArray(data) ? data : data.content || []);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchExistingPhases = async () => {
    try {
      const response = await fetch("/api/event/states");
      if (response.ok) {
        const data = await response.json();
        setExistingPhases(Array.isArray(data) ? data : data.content || []);
      }
    } catch (error) {
      console.error("Error fetching existing phases:", error);
    }
  };

  useEffect(() => {
    if (tournament) {
      const organizerName =
        tournament.organizer?.nickname || tournament.organizerName || "You";
      setForm({
        eventName: tournament.eventName || "",
        eventDescription: tournament.eventDescription || "",
        IconPath: tournament.IconPath || "",
        organizerName: organizerName,
        eventTags: Array.isArray(tournament.eventTags)
          ? tournament.eventTags.slice()
          : [],
        selectedPhases: [],
      });
    }
  }, [tournament]);

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
        <VideoBackground />
        <div className="absolute top-0 left-0 w-full h-full bg-[#0f1218]/90"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField("IconPath", event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPhase = (phase) => {
    setForm((prev) => ({
      ...prev,
      selectedPhases: [...(prev.selectedPhases || []), phase],
    }));
  };

  const removePhase = (idx) => {
    setForm((prev) => ({
      ...prev,
      selectedPhases: prev.selectedPhases.filter((_, i) => i !== idx),
    }));
  };

  const updatePhaseTime = (idx, field, value) => {
    setForm((prev) => {
      const phases = prev.selectedPhases.slice();
      phases[idx] = { ...phases[idx], [field]: value };
      return { ...prev, selectedPhases: phases };
    });
  };

  const handleSave = async () => {
    if (!form.eventName || form.eventName.trim() === "") {
      alert("Event name is required");
      return;
    }

    const payload = {
      eventName: form.eventName,
      eventDescription: form.eventDescription,
      IconPath: form.IconPath,
      organizerName: form.organizerName,
      eventTags: form.eventTags.map((t) =>
        typeof t === "string" ? t : t.eventTagName || t.name,
      ),
      eventStates: (form.selectedPhases || []).map((s) => ({
        eventStateName: typeof s === "string" ? s : s.eventStateName || s.name,
        startTime: s.startTime || "",
        endTime: s.endTime || "",
      })),
    };

    setIsSaving(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Tournament created:", result);
      alert("Tournament created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating tournament:", error);
      alert("Failed to create tournament. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!form) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
      <VideoBackground />
      <div className="absolute top-0 left-0 w-full h-full bg-[#0f1218]/90"></div>

      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-8 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-white rounded-xl text-sm font-bold tracking-widest text-white hover:bg-white hover:text-black transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 flex-1">
          <div className="md:w-1/3 flex flex-col gap-6">
            <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center overflow-hidden shadow-lg group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {form.IconPath ? (
                <img
                  src={form.IconPath}
                  alt={form.eventName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Trophy className="text-white/30" size={80} />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <Upload
                  className="text-white/60 group-hover:text-white"
                  size={32}
                />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="text-xs text-white/50 uppercase tracking-widest mb-3">
                Organizer
              </div>
              <div className="text-white text-sm font-bold">
                {form.organizerName}
              </div>
              <div className="text-xs text-white/40">Event Creator</div>
            </div>
          </div>

          <div className="md:w-2/3 flex flex-col gap-6">
            <div>
              <input
                value={form.eventName}
                onChange={(e) => updateField("eventName", e.target.value)}
                className="w-full text-4xl md:text-5xl font-bold text-white mb-4 leading-tight bg-transparent outline-none"
              />
              <textarea
                value={form.eventDescription}
                onChange={(e) =>
                  updateField("eventDescription", e.target.value)
                }
                className="w-full text-white/70 leading-relaxed bg-transparent outline-none min-h-[120px]"
              />
            </div>

            <div>
              <div className="text-xs text-white/50 uppercase tracking-widest mb-3">
                Tags
              </div>
              <div className="bg-black/40 border border-white/20 rounded backdrop-blur-sm p-2 flex flex-wrap gap-2 items-center min-h-10">
                {form.eventTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() =>
                        updateField(
                          "eventTags",
                          form.eventTags.filter((_, i) => i !== idx),
                        )
                      }
                      className="text-white/50 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <select
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      !form.eventTags.includes(e.target.value)
                    ) {
                      updateField("eventTags", [
                        ...form.eventTags,
                        e.target.value,
                      ]);
                      e.target.value = "";
                    }
                  }}
                  className="bg-transparent text-white outline-none cursor-pointer flex-shrink-0"
                >
                  <option value="">+ Add</option>
                  {allTags.map((tag, idx) => {
                    const tagName =
                      typeof tag === "string"
                        ? tag
                        : tag.name || tag.eventTagName;
                    const isAdded = form.eventTags.includes(tagName);
                    return (
                      <option key={idx} value={tagName} disabled={isAdded}>
                        {tagName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div>
                <div className="text-xs text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Clock size={14} />
                  Tournament Phases
                </div>

                <div className="mb-4">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const selectedPhase = existingPhases.find(
                          (p) =>
                            (typeof p === "string" ? p : p.id || p.name) ===
                            e.target.value,
                        );
                        if (
                          selectedPhase &&
                          !form.selectedPhases.find(
                            (sp) =>
                              (typeof sp === "string"
                                ? sp
                                : sp.id || sp.name) === e.target.value,
                          )
                        ) {
                          addPhase(selectedPhase);
                          e.target.value = "";
                        }
                      }
                    }}
                    className="w-full bg-black/40 text-white p-2 border border-white/20 rounded backdrop-blur-sm"
                  >
                    <option value="">Select a phase to add...</option>
                    {existingPhases.map((phase, idx) => {
                      const phaseId =
                        typeof phase === "string"
                          ? phase
                          : phase.id || phase.name;
                      const isAdded = form.selectedPhases.some(
                        (sp) =>
                          (typeof sp === "string" ? sp : sp.id || sp.name) ===
                          phaseId,
                      );
                      return (
                        <option key={idx} value={phaseId} disabled={isAdded}>
                          {typeof phase === "string"
                            ? phase
                            : phase.name || phase.eventStateName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {form.selectedPhases && form.selectedPhases.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left p-2 text-white/70">
                            Phase Name
                          </th>
                          <th className="text-left p-2 text-white/70">
                            Start Time
                          </th>
                          <th className="text-left p-2 text-white/70">
                            End Time
                          </th>
                          <th className="text-center p-2 text-white/70">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.selectedPhases.map((phase, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-white/10 hover:bg-white/5"
                          >
                            <td className="p-2 text-white">
                              {typeof phase === "string"
                                ? phase
                                : phase.name || phase.eventStateName}
                            </td>
                            <td className="p-2">
                              <input
                                type="datetime-local"
                                value={
                                  typeof phase === "string"
                                    ? ""
                                    : phase.startTime || ""
                                }
                                onChange={(e) =>
                                  updatePhaseTime(
                                    idx,
                                    "startTime",
                                    e.target.value,
                                  )
                                }
                                className="bg-white/10 text-white p-1 border border-white/20 rounded text-xs w-full"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="datetime-local"
                                value={
                                  typeof phase === "string"
                                    ? ""
                                    : phase.endTime || ""
                                }
                                onChange={(e) =>
                                  updatePhaseTime(
                                    idx,
                                    "endTime",
                                    e.target.value,
                                  )
                                }
                                className="bg-white/10 text-white p-1 border border-white/20 rounded text-xs w-full"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => removePhase(idx)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-white/50 text-sm p-4 text-center">
                    No phases selected yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTournament;
