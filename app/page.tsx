"use client";

import { useEffect, useState } from "react";

type TimeResponse = {
  iso: string;
};

const FIVE_MINUTES_MS = 5 * 60 * 1000;

async function fetchCurrentTime(): Promise<string> {
  const response = await fetch("/api/time", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch time");
  }

  const data: TimeResponse = await response.json();
  return data.iso;
}

export default function HomePage() {
  const [time, setTime] = useState<string>("");
  const [status, setStatus] = useState<string>("Fetching current time…");

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const updateTime = async () => {
      setStatus("Fetching current time…");
      try {
        const isoTime = await fetchCurrentTime();
        if (!isMounted) return;

        setTime(new Date(isoTime).toLocaleString());
        setStatus("Last updated just now");
      } catch (error) {
        if (!isMounted) return;
        setStatus("Unable to fetch time. Retrying in 5 minutes…");
      }
    };

    updateTime();
    intervalId = setInterval(async () => {
      await updateTime();
      if (isMounted) {
        setStatus("Last updated <span>just now</span>");
      }
    }, FIVE_MINUTES_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <main className="card">
      <h1>Current Time</h1>
      <p className="time-display">{time || "Loading…"}</p>
      <p className="status" dangerouslySetInnerHTML={{ __html: status }} />
      <p className="status">
        Automatically refreshes every <span>5 minutes</span>.
      </p>
    </main>
  );
}
