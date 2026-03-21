"use client";

import { useEffect } from "react";

const CURRENT_VERSION = "3";

export default function DataReset() {
  useEffect(() => {
    const v = localStorage.getItem("df_data_version");
    if (v !== CURRENT_VERSION) {
      // Clear old localStorage keys from the pre-Supabase era
      localStorage.removeItem("df_users");
      localStorage.removeItem("df_progress");
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
      localStorage.removeItem("df-intro-seen");
      localStorage.setItem("df_data_version", CURRENT_VERSION);
    }
  }, []);
  return null;
}
