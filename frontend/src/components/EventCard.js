import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const EventCard = ({ event }) => {
  const { user } = useAuthContext();
  const token = user.token;
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({ ...event });
  const [isRSVPed, setIsRSVPed] = useState(false);

   useEffect(() => {
     const checkRSVPStatus = async () => {
       try {
         const token = localStorage.getItem("token"); // Retrieve the token from local storage
         const userID = JSON.parse(localStorage.getItem("user"))._id; // Retrieve the user ID from local storage

         const response = await fetch(`/api/userRoutes/${userID}/events/rsvp`, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });
         const data = await response.json();
         if (response.ok) {
           const eventIDs = data.map((event) => event._id);
           const isRSVPed = eventIDs.includes(event._id);
           setIsRSVPed(isRSVPed);
         }
       } catch (error) {
         console.error("Error checking RSVP status:", error);
       }
     };
     checkRSVPStatus();
   }, [event._id, token]);

  const handleRSVPClick = async () => {
    try {
      const response = await fetch(`/api/events/${event._id}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setIsRSVPed(true);
        console.log("RSVP successful");
      }
    } catch (error) {
      console.error("Error RSVPing to event:", error);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(`/api/events/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updatedEvent.title,
          description: updatedEvent.description,
          date: updatedEvent.date,
          time: updatedEvent.time,
          location: updatedEvent.location,
          // Add other event attributes here
        }),
      });

      if (response.ok) {
        const updatedEventData = await response.json();
        setUpdatedEvent(updatedEventData); // Update the event state with the new data
        setIsEditing(false); // Exit the editing mode
      } else {
        console.error("Error updating event:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
const handleDeleteEvent = async () => {
  try {
    const response = await fetch(`/api/events/${event._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      // Perform any additional actions after successful deletion

      console.log("Event deleted successfully");
    } else {
      console.error("Error deleting event:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};
  return (
    <div className="event-card">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={updatedEvent.title}
            onChange={(e) =>
              setUpdatedEvent({ ...updatedEvent, title: e.target.value })
            }
          />
          <input
            type="text"
            value={updatedEvent.description}
            onChange={(e) =>
              setUpdatedEvent({ ...updatedEvent, description: e.target.value })
            }
          />
          <input
            type="text"
            value={updatedEvent.date}
            onChange={(e) =>
              setUpdatedEvent({ ...updatedEvent, description: e.target.value })
            }
          />
          <input
            type="text"
            value={updatedEvent.time}
            onChange={(e) =>
              setUpdatedEvent({ ...updatedEvent, description: e.target.value })
            }
          />
          <input
            type="text"
            value={updatedEvent.location}
            onChange={(e) =>
              setUpdatedEvent({ ...updatedEvent, description: e.target.value })
            }
          />
          {/* Add similar fields for other event attributes */}
          <button onClick={handleUpdateEvent}>Save</button>
        </div>
      ) : (
        <div>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Date: {event.date}</p>
          <p>Time: {event.time}</p>
          <p>Location: {event.location}</p>
          {user.role !== "admin" && (
            <button
              onClick={isRSVPed ? null : handleRSVPClick}
              disabled={isRSVPed}
            >
              {isRSVPed ? "Already RSVPed" : "RSVP"}
            </button>
          )}
          {user.role === "admin" && (
            <button onClick={() => setIsEditing(true)}>Update</button>
          )}
          {user.role === "admin" && (
            <button onClick={handleDeleteEvent}>Delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
