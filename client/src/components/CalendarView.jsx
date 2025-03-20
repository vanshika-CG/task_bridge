import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CalendarView.css";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

// Enhanced color schemes for different event types
const eventColors = {
  meeting: {
    gradients: [
      "linear-gradient(135deg, #3B82F6, #93C5FD)", // Blue theme for meetings
      "linear-gradient(135deg, #2563EB, #60A5FA)",
      "linear-gradient(135deg, #1D4ED8, #3B82F6)",
    ],
  },
  task: {
    priority: {
      high: {
        gradients: [
          "linear-gradient(135deg, #DC2626, #F87171)", // Red theme for high priority
          "linear-gradient(135deg, #B91C1C, #EF4444)",
          "linear-gradient(135deg, #991B1B, #DC2626)",
        ],
      },
      medium: {
        gradients: [
          "linear-gradient(135deg, #F59E0B, #FCD34D)", // Amber theme for medium priority
          "linear-gradient(135deg, #D97706, #FBBF24)",
          "linear-gradient(135deg, #B45309, #F59E0B)",
        ],
      },
      low: {
        gradients: [
          "linear-gradient(135deg, #10B981, #6EE7B7)", // Green theme for low priority
          "linear-gradient(135deg, #059669, #34D399)",
          "linear-gradient(135deg, #047857, #10B981)",
        ],
      },
    },
  },
};

// Function to get a gradient based on event type and priority
const getEventGradient = (event) => {
  if (event.type === "meeting") {
    const meetingGradients = eventColors.meeting.gradients;
    return meetingGradients[Math.floor(Math.random() * meetingGradients.length)];
  } else if (event.type === "task") {
    const priority = event.priority?.toLowerCase() || "medium";
    const priorityGradients =
      eventColors.task.priority[priority]?.gradients ||
      eventColors.task.priority.medium.gradients;
    return priorityGradients[Math.floor(Math.random() * priorityGradients.length)];
  }
  // Fallback gradient
  return "linear-gradient(135deg, #6B7280, #9CA3AF)";
};

// Enhanced Custom Event Component (without icons)
const CustomEvent = ({ event }) => {
  return (
    <div className="custom-event">
      <span className="event-title">{event.title}</span>
    </div>
  );
};

const CalendarView = ({ teamCode, userId, role }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isAdmin = role === "admin";

  // Log the props to verify userId, role, and teamCode
  console.log("CalendarView Props - User ID:", userId, "Role:", role, "Team Code:", teamCode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setEvents([]); // Clear previous events to prevent stale data

        const token = sessionStorage.getItem("token");
        console.log("Session Token:", token);
        if (!token) {
          toast.error("Please log in to view the calendar");
          navigate("/login");
          return;
        }

        if (!userId || !teamCode) {
          toast.error("User ID or Team Code is missing");
          navigate("/login");
          return;
        }

        // Fetch meetings (same for both admins and members)
        const meetingsResponse = await fetch(
          `https://task-bridge-eyh5.onrender.com/meetings/upcoming/${teamCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!meetingsResponse.ok) {
          throw new Error(`Meetings API error: ${meetingsResponse.status}`);
        }

        const meetings = await meetingsResponse.json();
        console.log("Fetched Meetings for User ID", userId, ":", meetings);

        // Fetch tasks (different endpoints for admins and members)
        let tasks = [];
        if (isAdmin) {
          // Admins fetch all tasks for the team
          const tasksResponse = await fetch(
            `https://task-bridge-eyh5.onrender.com/task/${teamCode}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!tasksResponse.ok) {
            throw new Error(`Tasks API error: ${tasksResponse.status}`);
          }

          tasks = await tasksResponse.json();
        } else {
          // Members fetch only their own tasks
          console.log(
            "Fetching tasks for member with URL:",
            `https://task-bridge-eyh5.onrender.com/task/member/${userId}/${teamCode}`
          );
          const tasksResponse = await fetch(
            `https://task-bridge-eyh5.onrender.com/task/member/${userId}/${teamCode}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!tasksResponse.ok) {
            throw new Error(`Tasks API error: ${tasksResponse.status}`);
          }

          tasks = await tasksResponse.json();
        }
        console.log("Fetched Tasks for User ID", userId, ":", tasks);

        // Additional client-side validation for members
        if (!isAdmin) {
          tasks = tasks.filter((task) =>
            task.team.some((memberId) => memberId.toString() === userId)
          );
        }

        // Process meetings
        const meetingEvents = Array.isArray(meetings)
          ? meetings
              .filter((meeting) =>
                isAdmin
                  ? true // Admins see all meetings
                  : meeting.participants.some((p) => p._id === userId) // Members see only their meetings
              )
              .map((meeting) => {
                const startTime = new Date(meeting.scheduledDate);
                const endTime = meeting.endTime
                  ? new Date(meeting.endTime)
                  : new Date(startTime.getTime() + 60 * 60 * 1000);

                return {
                  id: meeting._id,
                  title: meeting.title,
                  start: startTime,
                  end: endTime,
                  type: "meeting",
                  importance: meeting.importance || "high",
                  details: meeting,
                  gradient: getEventGradient({ type: "meeting" }),
                  allDay: false,
                };
              })
          : [];

        // Process tasks
        const taskEvents = Array.isArray(tasks)
          ? tasks.map((task) => {
              const startTime = new Date(task.date);
              const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1-hour duration
              const isOverdue = startTime < new Date() && task.stage !== "done";
              return {
                id: task._id,
                title: task.title,
                start: startTime,
                end: endTime,
                type: "task",
                priority: task.priority || "medium",
                details: task,
                gradient: getEventGradient({
                  type: "task",
                  priority: task.priority || "medium",
                }),
                isOverdue: isOverdue,
                allDay: false,
              };
            })
          : [];

        const allEvents = [...meetingEvents, ...taskEvents];
        console.log("Processed Events for User ID", userId, ":", allEvents);
        setEvents(allEvents);

        // Set reminders for upcoming events
        allEvents.forEach((event) => {
          const timeToEvent = event.start - new Date();
          if (timeToEvent > 0 && timeToEvent < 24 * 60 * 60 * 1000) {
            setTimeout(() => {
              toast.info(`Reminder: ${event.title} is starting soon!`);
            }, timeToEvent - 15 * 60 * 1000); // 15 minutes before
          }
        });
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        toast.error(`Failed to load calendar data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [teamCode, userId, isAdmin, navigate]);

  const getFilteredEvents = () => {
    switch (filter) {
      case "tasks":
        return events.filter((event) => event.type === "task");
      case "meetings":
        return events.filter((event) => event.type === "meeting");
      case "overdue":
        return events.filter((event) => event.isOverdue);
      case "upcoming":
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return events.filter((event) =>
          event.start >= new Date() && event.start <= tomorrow
        );
      case "all":
      default:
        return events;
    }
  };

  const eventStyleGetter = (event) => {
    const baseStyle = {
      background: event.gradient,
      borderRadius: "8px",
      opacity: 0.9,
      color: "white",
      border: "none",
      padding: "4px 8px",
      fontSize: "13px",
      fontWeight: "600",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    };

    if (event.isOverdue) {
      return {
        style: {
          ...baseStyle,
          border: "2px solid #dc2626",
          boxShadow: "0 0 8px rgba(220, 38, 38, 0.6)",
          animation: "pulse 1.5s infinite",
        },
      };
    }

    if (event.type === "meeting") {
      return {
        style: {
          ...baseStyle,
          fontWeight: "700",
        },
      };
    }

    return { style: baseStyle };
  };

  const handleSelectEvent = (event) => setSelectedEvent(event);

  const CustomDateCellWrapper = ({ children, value }) => {
    const hasEvents = events.some((event) =>
      moment(event.start).isSame(value, "day")
    );

    return React.cloneElement(children, {
      style: {
        ...children.props.style,
        position: "relative",
      },
      className: `${children.props.className} ${hasEvents ? "has-events" : ""}`,
    });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="calendar-container">
      {isLoading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading calendar...</p>
        </div>
      ) : (
        <>
          <div className="filter-buttons">
            <button
              onClick={() => setFilter("all")}
              className={filter === "all" ? "active" : ""}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("tasks")}
              className={filter === "tasks" ? "active" : ""}
            >
              Tasks
            </button>
            <button
              onClick={() => setFilter("meetings")}
              className={filter === "meetings" ? "active" : ""}
            >
              Meetings
            </button>
            <button
              onClick={() => setFilter("overdue")}
              className={filter === "overdue" ? "active" : ""}
            >
              Overdue
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={filter === "upcoming" ? "active" : ""}
            >
              Today & Tomorrow
            </button>
          </div>

          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            components={{
              dateCellWrapper: CustomDateCellWrapper,
              event: CustomEvent,
            }}
          />

          {selectedEvent && (
            <div className="modal">
              <h3>{selectedEvent.title}</h3>
              <p className="event-date">
                <strong>Date:</strong>{" "}
                {moment(selectedEvent.start).format("MMMM D, YYYY")}
              </p>
              {selectedEvent.type === "meeting" && (
                <p className="event-time">
                  <strong>Time:</strong>{" "}
                  {moment(selectedEvent.start).format("h:mm A")} -{" "}
                  {moment(selectedEvent.end).format("h:mm A")}
                </p>
              )}
              <p className="event-description">
                {selectedEvent.details.description ||
                  selectedEvent.details.agenda ||
                  "No description available"}
              </p>
              <p className="event-priority">
                {selectedEvent.type === "task"
                  ? `Priority: ${selectedEvent.priority || "Medium"}${
                      selectedEvent.isOverdue ? " (Overdue)" : ""
                    }`
                  : `Importance: ${selectedEvent.importance || "Standard"}`}
              </p>
              {selectedEvent.type === "task" && selectedEvent.details.stage && (
                <p className="event-status">
                  <strong>Status:</strong> {selectedEvent.details.stage}
                </p>
              )}
              <div className="modal-actions">
                <button onClick={() => setSelectedEvent(null)}>Close</button>
              </div>
            </div>
          )}
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default CalendarView;