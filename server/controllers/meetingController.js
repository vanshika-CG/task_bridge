const Meeting = require("../models/meetingModel");

// Create a new meeting
 const jwt = require('jsonwebtoken'); // Add this at the top of the file

exports.createMeeting = async (req, res) => {
  try {
    const { title, agenda, scheduledDate, participants, team_code } = req.body;

    if (!title || !agenda || !scheduledDate || !team_code) {
      return res.status(400).json({ message: "All fields including team_code are required" });
    }

    // Generate a JWT token for the meeting creator (moderator)
    const meetingToken = jwt.sign(
      {
        context: {
          user: {
            id: req.user.id, // User ID from TaskBridge
            name: req.user.full_name, // User's full name
            email: req.user.email, // User's email
            moderator: true, // Meeting creator is the moderator
          },
          group: team_code, // Team code
        },
        aud: 'your-app-id', // Must match Prosody's app_id
        iss: 'your-app-id', // Must match Prosody's app_id
        sub: 'your-domain', // Your Jitsi Meet domain
        room: title.replace(/\s+/g, "-"), // Room name (same as meeting title)
      },
      'your-app-secret', // JWT secret key (must match Prosody's app_secret)
      { expiresIn: '1h' } // Token expiry time
    );

    // Create the meeting with the meeting link
    const meeting = new Meeting({
      title,
      agenda,
      scheduledDate,
      createdBy: req.user.id,
      participants,
      team_code,
      meetingLink: `https://meet.jit.si/${title.replace(/\s+/g, "-")}?jwt=${meetingToken}`,
    });

    await meeting.save();
    res.status(201).json({ message: "Meeting scheduled successfully", meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
  
  



  exports.getUpcomingMeetings = async (req, res) => {
    try {
      const { team_code } = req.params; 
  
      if (!team_code) {
        return res.status(400).json({ message: "Team Code is required" });
      }
  
      const meetings = await Meeting.find({ team_code, scheduledDate: { $gte: new Date() } })
        .populate("createdBy", "full_name email")
        .populate("participants", "full_name email");
  
      res.status(200).json(meetings);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  


  exports.getMeetingById = async (req, res) => {
    try {
      const meeting = await Meeting.findById(req.params.id).populate("createdBy participants");
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });
  
      res.status(200).json(meeting);
    } catch (error) {
      res.status(500).json({ error: "Error fetching meeting details" });
    }
  };
  


  exports.joinMeeting = async (req, res) => {
    try {
      const meeting = await Meeting.findById(req.params.id);
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });
  
      // Check if the user is already a participant
      if (!meeting.participants.includes(req.user.id)) {
        meeting.participants.push(req.user.id); // Add the user to the participants list
        await meeting.save();
      }
  
      // Generate a JWT token for the joining user
      const meetingToken = jwt.sign(
        {
          context: {
            user: {
              id: req.user.id, // User ID from TaskBridge
              name: req.user.full_name, // User's full name
              email: req.user.email, // User's email
              moderator: false, // Joining user is not a moderator
            },
            group: meeting.team_code, // Team code
          },
          aud: 'your-app-id', // Must match Prosody's app_id
          iss: 'your-app-id', // Must match Prosody's app_id
          sub: 'your-domain', // Your Jitsi Meet domain
          room: meeting.title.replace(/\s+/g, "-"), // Room name (same as meeting title)
        },
        'your-app-secret', // JWT secret key (must match Prosody's app_secret)
        { expiresIn: '1h' } // Token expiry time
      );
  
      // Return the meeting link with the JWT token
      const meetingLink = `${meeting.meetingLink.split('?')[0]}?jwt=${meetingToken}`;
      res.status(200).json({ message: "Joined meeting successfully", meeting, meetingLink });
    } catch (error) {
      res.status(500).json({ error: "Error joining meeting" });
    }
  };
  


  exports.addNote = async (req, res) => {
    try {
      const { content } = req.body;
      const meeting = await Meeting.findById(req.params.id);
  
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });
  
      const userNote = meeting.notes.find((note) => note.user.toString() === req.user.id);
  
      if (userNote) {
        userNote.content = content;
        userNote.lastUpdated = new Date();
      } else {
        meeting.notes.push({ user: req.user.id, content });
      }
  
      await meeting.save();
      res.status(200).json({ message: "Note added successfully", meeting });
    } catch (error) {
      res.status(500).json({ error: "Error adding note" });
    }
  };

  

  exports.getMeetingChat = async (req, res) => {
    try {
      const meeting = await Meeting.findById(req.params.id).populate("chatMessages.sender");
  
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });
  
      res.status(200).json(meeting.chatMessages);
    } catch (error) {
      res.status(500).json({ error: "Error fetching chat history" });
    }
  };

  

