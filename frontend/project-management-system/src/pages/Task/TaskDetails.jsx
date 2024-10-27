import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utilis/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useUserInfo } from '../../hooks/userInfo';
import UserSearchBar from "../../components/SearchBar/UserSearchBar";
import { MdKeyboardDoubleArrowUp, MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import { formatDateTime } from "../../utilis/Helper";

const PRIORITYSTYLES = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-blue-100 text-blue-600",
};

const ICONS = {
    High: <MdKeyboardDoubleArrowUp />,
    Medium: <MdKeyboardArrowUp />,
    Low: <MdKeyboardArrowDown />,
};

const getStatusClasses = (status) => {
    const statusClasses = {
        Completed: "bg-green-100 text-green-600 font-semibold text-sm",
        "To Do": "bg-blue-100 text-blue-600 font-semibold text-sm",
        "In Progress": "bg-orange-100 text-orange-600 font-semibold text-sm",
        "Not Started": "bg-red-100 text-red-600 font-semibold text-sm",
        "On Hold": "bg-gray-100 text-gray-600 font-semibold text-sm",
    };
    return statusClasses[status] || "";
};

const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const userInfo = useUserInfo();

    const fetchTaskDetails = async () => {
        try {
            const response = await axiosInstance.get(`/tasks/task-details/${id}`);
            setTask(response.data);
            setAssignedUsers(response.data.assignedTo);
        } catch (error) {
            console.error("Error fetching task details:", error.response?.data || error.message);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axiosInstance.get(`/tasks/${id}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchTaskDetails();
        fetchComments();
    }, [id]);

    const handleRemoveUser = async (userId) => {
        const updatedUsers = task.assignedTo.filter(user => user._id !== userId);
        setAssignedUsers(updatedUsers);
        setTask(prevTask => ({ ...prevTask, assignedTo: updatedUsers }));
    
        try {
            const response = await axiosInstance.put(`/tasks/update-task/${id}`, {
                title: task.title,
                description: task.description,
                status: task.status,
                createdOn: task.createdOn,
                assignedTo: updatedUsers,
                dueDate: task.dueDate,
                createdBy: task.createdBy,
                priority: task.priority,
                project: task.project,
                comments: task.comments
            });
            if (response.status === 200) {
                console.log("User removed successfully");
            } else {
                throw new Error('Failed to remove user');
            }
        } catch (error) {
            console.error("Error removing user:", error.response?.data || error.message);
            setAssignedUsers(task.assignedTo);
            setTask(prevTask => ({ ...prevTask, assignedTo: prevTask.assignedTo }));
        }
    };
    
    const handleAssignUser = async (users) => {
        const newUsers = users.filter(user => !task.assignedTo.some(u => u._id === user._id));
        if (newUsers.length > 0) {
            const updatedUsers = [...task.assignedTo, ...newUsers];
    
            setAssignedUsers(updatedUsers);
            setTask(prevTask => ({ ...prevTask, assignedTo: updatedUsers }));
    
            try {
                const response = await axiosInstance.put(`/tasks/update-task/${id}`, {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    createdOn: task.createdOn,
                    assignedTo: updatedUsers,
                    dueDate: task.dueDate,
                    createdBy: task.createdBy,
                    priority: task.priority,
                    project: task.project,
                    comments: task.comments
                });
    
                if (response.status !== 200) {
                    throw new Error('Failed to update users');
                }
                console.log("Users updated successfully");
            } catch (error) {
                console.error("Error updating users:", error.response?.data || error.message);
                setAssignedUsers(task.assignedTo);
                setTask(prevTask => ({ ...prevTask, assignedTo: prevTask.assignedTo }));
            }
        }
    };
    

    const handleAddComment = async () => {
        if (newComment.trim() === "") return;
        try {
            const response = await axiosInstance.post(`/tasks/${id}/comments`, { comment: newComment });
            if (response.status === 201) {
                setComments(prevComments => [...prevComments, response.data]);
                setNewComment("");
            } else {
                console.error("Failed to add comment. Status code:", response.status);
            }
        } catch (error) {
            console.error("Error adding comment:", error.response?.data || error.message);
        }
    };

    if (!task) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col h-full bg-slate-200">
            <Navbar userInfo={userInfo} />
            <div className="flex flex-1 pt-12">
                <Sidebar />
                <div className="flex-1 overflow-y-auto p-8 ml-56 bg-slate-200">
                    <div className="mx-auto">

                        {/* Task Information Section */}
                        <section className="mb-8">
                            <div className="flex flex-col lg:flex-row lg:gap-8">
                                <div className="flex-1 bg-white p-6 rounded-md">
                                    <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                                    <p className="text-base">{task.description}</p>
                                    <div className="flex items-center gap-2 mt-4">
                                        <h3 className="text-base font-semibold text-black">Project:</h3>
                                        <p className="text-black text-md">{task.project?.name || 'N/A'}</p> 
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <h3 className="text-base font-semibold text-black">Created By:</h3>
                                        <p className="text-black text-md">{task.createdBy?.fullName || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex-1 bg-white p-6 rounded-md">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className='text-sm text-gray-500'>Due Date</span>
                                            <p className='text-md font-medium text-gray-800'>
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className='text-sm text-gray-500'>Priority</span>
                                            <div className={`flex items-center justify-center w-36 p-1 rounded-md ${PRIORITYSTYLES[task.priority]}`}>
                                                {ICONS[task.priority]}
                                                <span className="text-sm font-medium ml-1">{task.priority} Priority</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className='text-sm text-gray-500'>Status</span>
                                            <div className={`flex items-center justify-center w-24 p-1 rounded-md ${getStatusClasses(task.status)}`}>
                                                <span className="text-sm font-medium">{task.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Assigned Users Section */}
                        <div className="bg-white p-6 rounded-md mb-6">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-semibold text-gray-800">Assigned To</h3>
                                <UserSearchBar
                                    assignedUsers={assignedUsers}
                                    onAssignUsers={handleAssignUser}
                                    showSelectedUsers={false}
                                    taskId={id}
                                />
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-slate-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody className="bg-white">
                                            {assignedUsers.length > 0 ? assignedUsers.map(user => (
                                                <tr key={user._id} className="hover:bg-gray-100 transition-colors duration-300">
                                                    <td className="px-6 py-4 text-sm text-gray-700">{user.fullName}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        <button
                                                            onClick={() => handleRemoveUser(user._id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users assigned</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white p-6 rounded-md mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>
                            <div className="mb-4 flex items-start gap-2">
                                <textarea
                                    className="form-input-box flex-1"
                                    rows="1"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                ></textarea>
                                <button
                                    className="btn-primary w-36 text-xs p-2"
                                    onClick={handleAddComment}
                                >
                                    Add Comment
                                </button>
                            </div>
                            <div className="space-y-6">
                                {comments.length > 0 ? comments.map((comment) => (
                                    <div key={comment._id} className="p-4 bg-slate-200 border border-gray-200 rounded-md flex items-start space-x-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-sm font-semibold text-gray-800">{comment.user.fullName}</p>
                                                <span className="text-xs text-gray-500">{formatDateTime(comment.timestamp)}</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{comment.comment}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-500">No comments yet.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
