// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../style/task.css";

// const Task = () => {
//     const [tasks, setTasks] = useState([]);
//     const [selectedCommitType, setSelectedCommitType] = useState({});
//     const [commentText, setCommentText] = useState({});
//     const [expandedTask, setExpandedTask] = useState(null); // For showing task details
//     const [newTask, setNewTask] = useState({ 
//         title: "", description: "", priority: "normal", label: "", assignedMembers: [], date: "" 
//     });
//     const [teamMembers, setTeamMembers] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const token = sessionStorage.getItem("token");
//     const teamCode = JSON.parse(sessionStorage.getItem("team_code"));
//     const userRole = JSON.parse(sessionStorage.getItem("role"));
//     const user = JSON.parse(sessionStorage.getItem("user")); // Get logged-in user details

//     useEffect(() => {
//         fetchTasks();
//         fetchTeamMembers();
//     }, []);

//     // Fetch all tasks for the team
//     const fetchTasks = async () => {
//         try {
//             const response = await axios.get(`http://localhost:4400/task/${teamCode}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setTasks(response.data);
//         } catch (error) {
//             console.error("Error fetching tasks:", error);
//         }
//     };

//     // Fetch all team members
//     const fetchTeamMembers = async () => {
//         try {
//             const response = await axios.get(`http://localhost:4400/team/${teamCode}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setTeamMembers(response.data);
//         } catch (error) {
//             console.error("Error fetching team members:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setNewTask({ ...newTask, [e.target.name]: e.target.value });
//     };


//     const handleMemberSelection = (memberId) => {
//         setNewTask(prevState => {
//             const updatedMembers = prevState.assignedMembers.includes(memberId)
//                 ? prevState.assignedMembers.filter(id => id !== memberId)
//                 : [...prevState.assignedMembers, memberId];
//             return { ...prevState, assignedMembers: updatedMembers };
//         });
//     };


//     // Handle commit type selection
//     const handleCommitChange = (taskId, type) => {
//         setSelectedCommitType(prev => ({ ...prev, [taskId]: type }));
//         if (type !== "commented") {
//             setCommentText(prev => ({ ...prev, [taskId]: "" })); // Clear comment text if not 'commented'
//         }
//     };

//     // Handle commit submission
//     const handleCommit = async (taskId) => {
//         console.log(user)
//         if (!user || !user.full_name) {
//             alert("User data is not available. Please log in again.");
//             return;
//         }
    
//         const commitType = selectedCommitType[taskId] || "started";
//         const text = commentText[taskId]?.trim() || `Marked as ${commitType}`;
    
//         if (!text) {
//             alert("Commit text cannot be empty!");
//             return;
//         }
    
//         try {
//             const response = await axios.post(
//                 `http://localhost:4400/task/${taskId}/comments`,
//                 {
//                     type: commitType,
//                     text,
//                     user: user.full_name, // Now only runs if user exists
//                 },
//                 { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//             );
    
//             if (response.status === 200 || response.status === 201) {
//                 alert("Commit added successfully!");
//                 fetchTasks(); // Refresh task list
//             } else {
//                 alert("Failed to add commit.");
//             }
//         } catch (error) {
//             console.error("Error adding commit:", error.response?.data || error.message);
//             alert(`Error updating commit: ${error.response?.data?.message || "Please try again."}`);
//         }
//     };
    
//     // Format date function (this was referenced but not defined in the original code)
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleString();
//     };

//     // Handle task submission
//     const handleSubmit = async (e) => {
//         e.preventDefault(); // Prevent page reload
    
//         if (!newTask.title.trim() || !newTask.description.trim()) {
//             alert("Task title and description are required!");
//             return;
//         }
    
//         setLoading(true);
    
//         try {
//             const response = await axios.post(
//                 `http://localhost:4400/task`,
//                 {
//                     team_code: teamCode,
//                     title: newTask.title.trim(),
//                     description: newTask.description.trim(),
//                     priority: newTask.priority,
//                     label: newTask.label.trim(),
//                     date: new Date(newTask.date).toISOString(), // Ensure correct date format
//                     assignedMembers: newTask.assignedMembers, // Fix key name
//                 },
//                 { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//             );
    
//             if (response.status === 201) {
//                 alert("Task added successfully!");
//                 fetchTasks(); // Refresh the task list
//                 setNewTask({ title: "", description: "", priority: "normal", label: "", assignedMembers: [], date: "" }); // Clear form
//             } else {
//                 alert("Failed to add task.");
//             }
//         } catch (error) {
//             console.error("Error adding task:", error.response?.data || error.message);
//             alert(`Error adding task: ${error.response?.data?.message || "Please try again."}`);
//         } finally {
//             setLoading(false);
//         }
//     };
    

//     const handleDelete = async (taskId) => {
//         try {
//             await axios.delete(`http://localhost:4400/task/delete/${taskId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             fetchTasks();
//         } catch (error) {
//             console.error('Error deleting task:', error);
//         }
//     };

            
//     const handleStageUpdate = async (taskId, newStage) => {
//         try {
//             await axios.patch(`http://localhost:4400/task/${taskId}`, { stage: newStage }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setTasks(prevTasks =>
//                 prevTasks.map(task =>
//                     task._id === taskId ? { ...task, stage: newStage } : task
//                 )
//             );
//         } catch (error) {
//             console.error('Error updating task stage:', error);
//         }
//     };

//     return (
// //         <div className="task-container">
// //             <h2>Task Management</h2>

// //             {/* Admin can add tasks */}
// //             {userRole === "admin" && (
// //                 <form className="task-form" onSubmit={handleSubmit}>
// //                     <input 
// //                         type="text" name="title" placeholder="Task Title" 
// //                         value={newTask.title} 
// //                         onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
// //                         required 
// //                     />
// //                     <textarea 
// //                         name="description" placeholder="Task Description" 
// //                         value={newTask.description} 
// //                         onChange={handleChange}  
// //                         required
// //                     ></textarea>
// //                     <select name="priority" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
// //                         <option value="high">High</option>
// //                         <option value="medium">Medium</option>
// //                         <option value="normal">Normal</option>
// //                         <option value="low">Low</option>
// //                     </select>
// //                     <select name="label" value={newTask.label} onChange={(e) => setNewTask( {...newTask, label: e.target.value})}>
// //                           <option value="research">research</option>
// //                          <option value="design">design</option>
// //                         <option value="content">content</option>
// //                          <option value="planning">planning</option>
// //                     </select>
                 
// //                     <input 
// //                         type="date" name="date" 
// //                         value={newTask.date} 
// //                         onChange={handleChange} 
// //                         required 
// //                     />

// //                     <div className="assign-members">
// //                         <h3>Assign to Members:</h3>
// //                         {teamMembers.length > 0 ? teamMembers.map(member => (
// //                             <div key={member._id} className="member-checkbox">
// //                                 <input 
// //                                     type="checkbox" 
// //                                     id={member._id} 
// //                                     checked={newTask.assignedMembers.includes(member._id)}
// //                                     onChange={() => handleMemberSelection(member._id)}
// //                                 />
// //                                 <label htmlFor={member._id}>{member.full_name}</label>
// //                             </div>
// //                         )) : <p>No team members available</p>}
// //                     </div>

// //                     <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Task"}</button>
// //                 </form>
// //             )}

// //             {/* Task List */}
// //             <div className="task-list">
// //                 {tasks.length > 0 ? tasks.map((task) => (
// //                     <div key={task._id} className="task-item">
// //                         <h3>{task.title}</h3>
// //                         <p>{task.description}</p>
// //                         <p><strong>Priority:</strong> {task.priority}</p>
// //                         <p><strong>Label:</strong> {task.label}
                       
// //                         </p>
// //                         <p><strong>Date:</strong> {task.date}</p>

// //                         <p><strong>Status:</strong> 
// //                             <select value={task.stage} onChange={(e) => handleStageUpdate(task._id, e.target.value)}>
// //                                 <option value="todo">Todo</option>
// //                                 <option value="in progress">In Progress</option>
// //                                 <option value="review">Review</option>
// //                                 <option value="done">Done</option>
// //                             </select>
// //                         </p>

// //                         {userRole === 'admin' && <button onClick={() => handleDelete(task._id)}>Delete</button>}

// //                         <button onClick={() => setExpandedTask(task._id === expandedTask ? null : task._id)}>
// //                             {expandedTask === task._id ? "Hide Details" : "View Details"}
// //                         </button>



// //                         {expandedTask === task._id && (
// //     <div className="task-details">
// //         <h4>Task Activity</h4>
// //         {task.activities.length > 0 || task.comments.length > 0 ? (
// //             <ul className="activity-list">
// //                 {[...(task.activities || []), ...(task.comments || [])]
// //                     .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)) // Sort by latest date
// //                     .map((activity, index) => {
// //                         // Find the user who performed this activity (checking `by` for activities and `user` for comments)
// //                         const userInfo = teamMembers.find(member => member._id === (activity.by || activity.user));
                        
// //                         return (
// //                             <li key={index}>
// //                                 <strong>{userInfo ? userInfo.full_name : "Unknown User"}</strong>
// //                                 <span> ({activity.type}) </span> -  
// //                                 <em>{activity.activity || activity.text}</em>  
// //                                 <span className="date"> [{formatDate(activity.date || activity.createdAt)}] </span>
// //                             </li>
// //                         );
// //                     })}
// //             </ul>
// //         ) : (
// //             <p>No activity recorded yet.</p>
// //         )}
// //     </div>
// // )}




                        
// //                         {/* Commit Section */}
// //                         <div className="commit-section">
// //                             <h4>Commit Activity</h4>
// //                             <div className="commit-options">
// //                                 {["started", "in progress", "bug", "completed", "commented"].map(type => (
// //                                     <label key={type}>
// //                                         <input 
// //                                             type="radio" 
// //                                             name={`commit-${task._id}`} 
// //                                             value={type} 
// //                                             checked={selectedCommitType[task._id] === type} 
// //                                             onChange={() => handleCommitChange(task._id, type)} 
// //                                         />
// //                                         {type}
// //                                     </label>
// //                                 ))}
// //                             </div>

// //                             {selectedCommitType[task._id] && (
// //                                 <textarea 
// //                                     placeholder="Enter commit message..." 
// //                                     value={commentText[task._id] || ""} 
// //                                     onChange={(e) => setCommentText(prev => ({ ...prev, [task._id]: e.target.value }))} 
// //                                 ></textarea>
// //                             )}

// //                             <button onClick={() => handleCommit(task._id)}>Commit</button>
// //                         </div>
// //                     </div>
// //                 )) : <p>No tasks available</p>}
// //             </div>
// //         </div>


//                 <div className="task-dashboard">
//     <h2>Task Management</h2>

//     {/* Admin can add tasks */}
//     {userRole === "admin" && (
//         <form className="task-creation-form" onSubmit={handleSubmit}>
//             <input type="text" name="title" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
//             <textarea name="description" placeholder="Task Description" value={newTask.description} onChange={handleChange} required></textarea>
            
//             <select name="priority" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
//                 <option value="high">High</option>
//                 <option value="medium">Medium</option>
//                 <option value="normal">Normal</option>
//                 <option value="low">Low</option>
//             </select>

//             <select name="label" value={newTask.label} onChange={(e) => setNewTask( {...newTask, label: e.target.value})}>
//                 <option value="research">Research</option>
//                 <option value="design">Design</option>
//                 <option value="content">Content</option>
//                 <option value="planning">Planning</option>
//             </select>
         
//             <input type="date" name="date" value={newTask.date} onChange={handleChange} required />

//             <div className="assign-members">
//                 <h3>Assign to Members:</h3>
//                 {teamMembers.length > 0 ? teamMembers.map(member => (
//                     <div key={member._id} className="member-checkbox">
//                         <input type="checkbox" id={member._id} checked={newTask.assignedMembers.includes(member._id)}
//                             onChange={() => handleMemberSelection(member._id)}
//                         />
//                         <label htmlFor={member._id}>{member.full_name}</label>
//                     </div>
//                 )) : <p>No team members available</p>}
//             </div>

//             <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Task"}</button>
//         </form>
//     )}

//     {/* Task List */}
//     <div className="task-board">
//         {tasks.length > 0 ? tasks.map((task) => (
//             <div key={task._id} className="task-card">
//                 <h3>{task.title}</h3>
//                 <p>{task.description}</p>
//                 <p><strong>Priority:</strong> {task.priority}</p>
//                 <p><strong>Label:</strong> {task.label}</p>
//                 <p><strong>Date:</strong> {task.date}</p>

//                 <p><strong>Status:</strong> 
//                     <select value={task.stage} onChange={(e) => handleStageUpdate(task._id, e.target.value)}>
//                         <option value="todo">Todo</option>
//                         <option value="in progress">In Progress</option>
//                         <option value="review">Review</option>
//                         <option value="done">Done</option>
//                     </select>
//                 </p>

//                 {userRole === 'admin' && <button onClick={() => handleDelete(task._id)}>Delete</button>}

//                 <button onClick={() => setExpandedTask(task._id === expandedTask ? null : task._id)}>
//                     {expandedTask === task._id ? "Hide Details" : "View Details"}
//                 </button>

//                 {expandedTask === task._id && (
//                     <div className="task-info-panel">
//                         <h4>Task Activity</h4>
//                         {task.activities.length > 0 || task.comments.length > 0 ? (
//                             <ul className="task-activity-log">
//                                 {[...(task.activities || []), ...(task.comments || [])]
//                                     .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
//                                     .map((activity, index) => {
//                                         const userInfo = teamMembers.find(member => member._id === (activity.by || activity.user));
//                                         return (
//                                             <li key={index}>
//                                                 <strong>{userInfo ? userInfo.full_name : "Unknown User"}</strong>
//                                                 <span> ({activity.type}) </span> -  
//                                                 <em>{activity.activity || activity.text}</em>  
//                                                 <span className="date"> [{formatDate(activity.date || activity.createdAt)}] </span>
//                                             </li>
//                                         );
//                                     })}
//                             </ul>
//                         ) : (
//                             <p>No activity recorded yet.</p>
//                         )}
//                     </div>
//                 )}

//                 {/* Commit Section */}
//                 <div className="task-commit-area">
//                     <h4>Commit Activity</h4>
//                     <div className="task-commit-options">
//                         {["started", "in progress", "bug", "completed", "commented"].map(type => (
//                             <label key={type}>
//                                 <input 
//                                     type="radio" 
//                                     name={`commit-${task._id}`} 
//                                     value={type} 
//                                     checked={selectedCommitType[task._id] === type} 
//                                     onChange={() => handleCommitChange(task._id, type)} 
//                                 />
//                                 {type}
//                             </label>
//                         ))}
//                     </div>

//                     {selectedCommitType[task._id] && (
//                         <textarea 
//                             placeholder="Enter commit message..." 
//                             value={commentText[task._id] || ""} 
//                             onChange={(e) => setCommentText(prev => ({ ...prev, [task._id]: e.target.value }))} 
//                         ></textarea>
//                     )}

//                     <button onClick={() => handleCommit(task._id)}>Commit</button>
//                 </div>
//             </div>
//         )) : <p>No tasks available</p>}
//     </div>
// </div>

//     );
// };

// export default Task;






import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/task.css";

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedCommitType, setSelectedCommitType] = useState({});
    const [commentText, setCommentText] = useState({});
    const [expandedTask, setExpandedTask] = useState(null); // For showing task details
    const [newTask, setNewTask] = useState({ 
        title: "", description: "", priority: "normal", label: "", assignedMembers: [], date: "" 
    });
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = sessionStorage.getItem("token");
    const teamCode = JSON.parse(sessionStorage.getItem("team_code"));
    const userRole = JSON.parse(sessionStorage.getItem("role"));
    const user = JSON.parse(sessionStorage.getItem("user")); // Get logged-in user details

    useEffect(() => {
        fetchTasks();
        fetchTeamMembers();
    }, []);

    // Fetch all tasks for the team
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://localhost:4400/task/${teamCode}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Fetch all team members
    const fetchTeamMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:4400/team/${teamCode}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeamMembers(response.data);
        } catch (error) {
            console.error("Error fetching team members:", error);
        }
    };

    const handleChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };


    const handleMemberSelection = (memberId) => {
        setNewTask(prevState => {
            const updatedMembers = prevState.assignedMembers.includes(memberId)
                ? prevState.assignedMembers.filter(id => id !== memberId)
                : [...prevState.assignedMembers, memberId];
            return { ...prevState, assignedMembers: updatedMembers };
        });
    };


    // Handle commit type selection
    const handleCommitChange = (taskId, type) => {
        setSelectedCommitType(prev => ({ ...prev, [taskId]: type }));
        if (type !== "commented") {
            setCommentText(prev => ({ ...prev, [taskId]: "" })); // Clear comment text if not 'commented'
        }
    };

    // Handle commit submission
    const handleCommit = async (taskId) => {
        console.log(user)
        if (!user || !user.full_name) {
            alert("User data is not available. Please log in again.");
            return;
        }
    
        const commitType = selectedCommitType[taskId] || "started";
        const text = commentText[taskId]?.trim() || `Marked as ${commitType}`;
    
        if (!text) {
            alert("Commit text cannot be empty!");
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:4400/task/${taskId}/comments`,
                {
                    type: commitType,
                    text,
                    user: user.full_name, // Now only runs if user exists
                },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
    
            if (response.status === 200 || response.status === 201) {
                alert("Commit added successfully!");
                fetchTasks(); // Refresh task list
            } else {
                alert("Failed to add commit.");
            }
        } catch (error) {
            console.error("Error adding commit:", error.response?.data || error.message);
            alert(`Error updating commit: ${error.response?.data?.message || "Please try again."}`);
        }
    };
    
    // Format date function (this was referenced but not defined in the original code)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Handle task submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
    
        if (!newTask.title.trim() || !newTask.description.trim()) {
            alert("Task title and description are required!");
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await axios.post(
                `http://localhost:4400/task`,
                {
                    team_code: teamCode,
                    title: newTask.title.trim(),
                    description: newTask.description.trim(),
                    priority: newTask.priority,
                    label: newTask.label.trim(),
                    date: new Date(newTask.date).toISOString(), // Ensure correct date format
                    assignedMembers: newTask.assignedMembers, // Fix key name
                },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
    
            if (response.status === 201) {
                alert("Task added successfully!");
                fetchTasks(); // Refresh the task list
                setNewTask({ title: "", description: "", priority: "normal", label: "", assignedMembers: [], date: "" }); // Clear form
            } else {
                alert("Failed to add task.");
            }
        } catch (error) {
            console.error("Error adding task:", error.response?.data || error.message);
            alert(`Error adding task: ${error.response?.data?.message || "Please try again."}`);
        } finally {
            setLoading(false);
        }
    };
    

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`http://localhost:4400/task/delete/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

            
    const handleStageUpdate = async (taskId, newStage) => {
        try {
            await axios.patch(`http://localhost:4400/task/${taskId}`, { stage: newStage }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? { ...task, stage: newStage } : task
                )
            );
        } catch (error) {
            console.error('Error updating task stage:', error);
        }
    };

    return (
        <div className="task-details-container">
            <div className="task-details-header">
                <h2>Task Management</h2>
            </div>

            {userRole === "admin" && (
                <form className="task-creation-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="Task Title"
                            value={newTask.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <textarea 
                            name="description"
                            className="form-textarea"
                            placeholder="Task Description"
                            value={newTask.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <div className="form-label">Priority</div>
                            <select 
                                name="priority"
                                className="form-select"
                                value={newTask.priority}
                                onChange={handleChange}
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="normal">Normal</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <div className="form-label">Label</div>
                            <select 
                                name="label"
                                className="form-select"
                                value={newTask.label}
                                onChange={handleChange}
                            >
                                <option value="research">Research</option>
                                <option value="design">Design</option>
                                <option value="content">Content</option>
                                <option value="planning">Planning</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <div className="form-label">Due Date</div>
                            <input 
                                type="date"
                                name="date"
                                className="form-input"
                                value={newTask.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="member-assignment-section">
                        <h3>Assign to Members</h3>
                        <div className="member-list">
                            {teamMembers.length > 0 ? teamMembers.map(member => (
                                <div key={member._id} className="member-item">
                                    <label htmlFor={member._id}>{member.full_name}</label>
                                    <input 
                                        type="checkbox"
                                        id={member._id}
                                        checked={newTask.assignedMembers.includes(member._id)}
                                        onChange={() => handleMemberSelection(member._id)}
                                    />
                                </div>
                            )) : <p>No team members available</p>}
                        </div>
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Adding..." : "Add Task"}
                    </button>
                </form>
            )}

            <div className="task-list">
                {tasks.length > 0 ? tasks.map((task) => (
                    <div 
                        key={task._id} 
                        className="task-card"
                        data-status={task.stage}
                    >
                        <div className="task-header">
                            <h3 className="task-title">{task.title}</h3>
                            <div className="task-badges">
                                <span className={`priority-badge ${task.priority}`}>
                                    {task.priority}
                                </span>
                                <span className="label-badge">{task.label}</span>
                            </div>
                        </div>

                        <div className="task-body">
                            <p className="task-description">{task.description}</p>
                            <div className="task-meta">
                                <p><strong>Due Date:</strong> {formatDate(task.date)}</p>
                                <div className="task-status">
                                    <strong>Status:</strong>
                                    <select 
                                        className="status-select"
                                        value={task.stage}
                                        onChange={(e) => handleStageUpdate(task._id, e.target.value)}
                                    >
                                        <option value="todo">Todo</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="task-actions">
                            {userRole === 'admin' && (
                                <button 
                                    className="delete-button" 
                                    onClick={() => handleDelete(task._id)}
                                >
                                    Delete
                                </button>
                            )}
                            <button 
                                className="details-button"
                                onClick={() => setExpandedTask(task._id === expandedTask ? null : task._id)}
                            >
                                {expandedTask === task._id ? "Hide Details" : "View Details"}
                            </button>
                        </div>

                        {expandedTask === task._id && (
                            <div className="task-details">
                                <div className="activity-section">
                                    <h4>Task Activity</h4>
                                    {task.activities?.length > 0 || task.comments?.length > 0 ? (
                                        <ul className="activity-list">
                                            {[...(task.activities || []), ...(task.comments || [])]
                                                .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
                                                .map((activity, index) => {
                                                    const userInfo = teamMembers.find(member => 
                                                        member._id === (activity.by || activity.user)
                                                    );
                                                    
                                                    return (
                                                        <li key={index} className="activity-item">
                                                            <div className="activity-header">
                                                                <strong>{userInfo ? userInfo.full_name : "Unknown User"}</strong>
                                                                <span className="activity-type">({activity.type})</span>
                                                            </div>
                                                            <p className="activity-text">{activity.activity || activity.text}</p>
                                                            <span className="activity-date">
                                                                {formatDate(activity.date || activity.createdAt)}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    ) : (
                                        <p className="no-activity">No activity recorded yet.</p>
                                    )}
                                </div>

                                <div className="commit-section">
                                    <h4>Add Activity</h4>
                                    <div className="commit-options">
                                        {["started", "in progress", "bug", "completed", "commented"].map(type => (
                                            <label key={type} className="commit-option">
                                                <input 
                                                    type="radio"
                                                    name={`commit-${task._id}`}
                                                    value={type}
                                                    checked={selectedCommitType[task._id] === type}
                                                    onChange={() => handleCommitChange(task._id, type)}
                                                />
                                                <span>{type}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {selectedCommitType[task._id] && (
                                        <textarea 
                                            className="commit-textarea"
                                            placeholder="Enter activity details..."
                                            value={commentText[task._id] || ""}
                                            onChange={(e) => setCommentText(prev => ({ 
                                                ...prev, [task._id]: e.target.value 
                                            }))}
                                        ></textarea>
                                    )}

                                    <button 
                                        className="commit-button"
                                        onClick={() => handleCommit(task._id)}
                                    >
                                        Add Activity
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <p className="no-tasks">No tasks available</p>
                )}
            </div>
        </div>
    );
};

export default Task;