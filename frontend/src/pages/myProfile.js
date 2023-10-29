import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";

const MyProfile = () => {
  const { user } = useAuthContext();
  const [rsvpdEvents, setRsvpdEvents] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/userRoutes/${user?._id}`, {
          // Use optional chaining to handle null values
          headers: { Authorization: `Bearer ${user?.token}` }, // Use optional chaining to handle null values
        });
        const data = await response.json();
        console.log("Data from API:", data); // Log the data to check its contents
        if (response.ok) {
          // Fetch event details for each RSVP'd event
          const fetchedEvents = await Promise.all(
            data.rsvpdEvents.map(async (eventId) => {
              const response = await fetch(`/api/events/${eventId}`, {
                headers: { Authorization: `Bearer ${user?.token}` }, // Use optional chaining to handle null values
              });
              const eventData = await response.json();
              return eventData;
            })
          );
          setRsvpdEvents(fetchedEvents);
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user?.token, user?._id]); // Use optional chaining to handle null values

  // ... rest of the code
  return (
    user && ( // Add conditional rendering for the user object
    <>
    <Navbar />
      <div className="profile-container">
        <div className="profile-section">
          {/* Profile photo SVG */}
          <svg
            className="profile-photo bi bi-person-circle"
            width="3em"
            height="3em"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 0a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zm0 1a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm0 9c3 0 5 1 5 2v1H3v-1c0-1 2-2 5-2z" />
          </svg>
          <div className="profile-details">
            <h2>{username}</h2>{" "}
            {/* Use the local username state to prevent accessing null values */}
            <p>Email: {user.email}</p>
          </div>
        </div>
        <div className="rsvp-events-section">
          <h3>RSVP'd Events</h3>
          <div className="rsvp-events-container">
            {rsvpdEvents.length > 0 ? (
              <ul>
                {rsvpdEvents.map((event, index) => (
                  <li key={index}>
                    {event && event.title
                      ? event.title
                      : "Event Cancelled"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No RSVP'd events yet</p>
            )}
          </div>
        </div>
      </div>
      </>
    )
  );
};

export default MyProfile;
