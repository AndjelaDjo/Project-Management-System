import { useState, useEffect } from "react";
import axiosInstance from '../../utilis/axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import TaskCard from '../../components/Cards/TaskCard';
import TaskTableView from '../Task/TaskTableView';
import TaskTitle from '../../components/TaskTitle/TaskTitle';
import AddTaskCard from '../../components/Cards/AddTaskCard';
import { useUserInfo } from '../../hooks/userInfo';
import { IoMdAdd } from "react-icons/io";
import { CiBoxList } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";

const TASK_TYPE = {
    todo: "bg-blue-600",
    "in progress": "bg-yellow-600",
    completed: "bg-green-600",
};

const PRIORITY_ORDER = {
    high: 1,
    medium: 2,
    low: 3,
};

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewType, setViewType] = useState("board");
    const userInfo = useUserInfo();
    const [showModal, setShowModal] = useState(false);

    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks/get-task');
            const sortedTasks = response.data.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
            setTasks(sortedTasks);
            setFilteredTasks(sortedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const deleteTask = async (deletedTaskId) => {
        try {
            await axiosInstance.delete(`/tasks/${deletedTaskId}`);
            fetchTasks(); 
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSearch = () => {
        const results = tasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTasks(results);
    };

    const onClearSearch = () => {
        setSearchQuery("");
        setFilteredTasks(tasks);
    };

    const toggleModal = () => {
        setShowModal(prevShowModal => !prevShowModal);
    };

    const handleTaskAdded = () => {
        fetchTasks(); 
    };

    return (
        <div className="flex flex-col h-full bg-slate-200 ">
            <Navbar
                userInfo={userInfo}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />
            <div className="flex flex-1 pt-12 ">
                <Sidebar />
                <div className="flex-1 overflow-y-auto p-6 ml-56 h-screen bg-slate-200">
                    <div className="w-full flex justify-between items-center gap-4 md:gap-x-12 py-2">
                        <h2 className="text-xl font-semibold">Tasks</h2>
                        <button className="btn-primary w-32 flex items-center space-x-2 h-8 px-3" onClick={toggleModal}>
                            <IoMdAdd size={18} />
                            <span>Add Task</span>
                        </button>
                        <AddTaskCard isOpen={showModal} onClose={toggleModal} onTaskAdded={handleTaskAdded} />
                    </div>
                    <div className="flex space-x-4 my-2">
                        <button
                            className={`flex items-center justify-center w-32 p-2 rounded-md ${viewType === 'board' ? 'bg-purple-600 text-white' : 'bg-white text-gray-500'} hover:bg-purple-700 hover:text-white transition-colors`}
                            onClick={() => setViewType('board')}
                        >
                            <RxDashboard size={14} />
                            <span className="ml-2 text-sm">Board View</span>
                        </button>
                        <button
                            className={`flex items-center justify-center w-32 p-2 rounded-md ${viewType === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-500'} hover:bg-purple-700 hover:text-white transition-colors`}
                            onClick={() => setViewType('list')}
                        >
                            <CiBoxList size={16} />
                            <span className="ml-2 text-sm">List View</span>
                        </button>
                    </div>
                    <div className="w-full flex gap-4 md:gap-x-12 py-4">
                        {viewType === 'board' ? (
                            <>
                                <div className="flex-1">
                                    <h2 className="text-2xl mb-4">
                                        <TaskTitle label="To Do" className={TASK_TYPE.todo} />
                                    </h2>
                                    {filteredTasks.filter((task) => task.status === "To Do").map((task) => (
                                        <TaskCard key={task._id} task={task} onDelete={deleteTask} onTaskUpdated={fetchTasks} />
                                    ))}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl mb-4">
                                        <TaskTitle label="In Progress" className={TASK_TYPE["in progress"]} />
                                    </h2>
                                    {filteredTasks.filter((task) => task.status === "In Progress").map((task) => (
                                        <TaskCard key={task._id} task={task} onDelete={deleteTask} onTaskUpdated={fetchTasks} />
                                    ))}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl mb-4">
                                        <TaskTitle label="Completed" className={TASK_TYPE.completed} />
                                    </h2>
                                    {filteredTasks.filter((task) => task.status === "Completed").map((task) => (
                                        <TaskCard key={task._id} task={task} onDelete={deleteTask} onTaskUpdated={fetchTasks} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <TaskTableView tasks={filteredTasks} onDelete={deleteTask} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Task;
