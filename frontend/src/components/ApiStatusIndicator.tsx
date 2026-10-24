"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface HealthData {
  status: string;
  service: string;
}

export function ApiStatusIndicator() {
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");
  const [serviceName, setServiceName] = useState<string>("interviewos-api");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const checkHealth = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    const start = performance.now();

    try {
      const res = await fetch(`${apiUrl}/api/v1/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);

      if (!res.ok) {
        setStatus("offline");
        setErrorMessage(`HTTP Error: ${res.status} ${res.statusText}`);
        return;
      }

      const json = (await res.json()) as HealthData;
      if (json.status === "ok") {
        setServiceName(json.service);
        setStatus("online");
      } else {
        setStatus("offline");
        setErrorMessage("Invalid status response from API");
      }
    } catch (err: unknown) {
      setStatus("offline");
      setLatency(null);
      if (err instanceof Error) {
        setErrorMessage(err.message.includes("fetch") ? "Backend unreachable (connection refused)" : err.message);
      } else {
        setErrorMessage("Unknown network error occurred");
      }
    }
  }, [apiUrl]);

  useEffect(() => {
    let mounted = true;

    const runProbe = async () => {
      if (mounted) {
        await checkHealth();
      }
    };

    // Run probe on mount via microtask
    const timer = setTimeout(runProbe, 0);
    const interval = setInterval(runProbe, 30000);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [checkHealth]);

  return (
    <div
      title={status === "online" ? `Connected to ${serviceName}` : errorMessage || "Backend offline"}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono transition-all"
    >
      {status === "loading" && (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
          <span className="text-neutral-600 dark:text-neutral-400">Probing API...</span>
        </>
      )}

      {status === "online" && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
            API Active
          </span>
          {latency !== null && (
            <span className="text-neutral-500 text-[10px]">
              {latency}ms
            </span>
          )}
        </>
      )}

      {status === "offline" && (
        <>
          <span className="h-2 w-2 rounded-full bg-rose-500"></span>
          <span className="text-rose-600 dark:text-rose-400 font-medium">
            API Offline
          </span>
          <button
            onClick={() => checkHealth()}
            title={errorMessage || "Click to retry backend connection"}
            className="ml-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform" />
          </button>
        </>
      )}
    </div>
  );
}
