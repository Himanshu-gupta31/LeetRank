"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query; // Get the username from the query parameter
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (username) {
      // Ensure username is a string before passing to fetchProfileData
      fetchProfileData(Array.isArray(username) ? username[0] : username);
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
    <div className="profile-container">
      {profileData ? (
        <div>
          <p>Hello</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
