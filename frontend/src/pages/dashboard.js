import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";
import { useAuthContext } from "../hooks/useAuthContext";
import NewEventForm from "../components/newEventForm";

const Dashboard = () => {
  const [events, setEvents] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/events/dashboard", {
          headers: { Authorization: `Bearer ${user?.token}` }, // Use optional chaining to handle null values
        });
        const data = await response.json();
        if (response.ok) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      {user && user.role === "admin" && (
        <NewEventForm setEvents={setEvents} />
      )}{" "}
      {events &&
        events.map((event, index) => <EventCard key={index} event={event} />)}
    </div>
  );
};

export default Dashboard;
