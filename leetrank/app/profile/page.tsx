"use client";

import React, { useEffect, useState } from "react";

export default function ProfilePage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const username = searchParams.username;
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (username) {
      fetchProfileData(username);
    }
  }, [username]);

  const fetchProfileData = async (username: string) => {
    try {
      const response = await fetch(`/api/fetchuserdetails?username=${username}`);
      const data = await response.json();
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred while fetching the profile details.");
      console.error(error);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div>{profileData ? JSON.stringify(profileData) : "Loading profile data..."}</div>
    </div>
  );
}
