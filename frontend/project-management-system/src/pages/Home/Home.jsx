import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utilis/axiosInstance";
import DashboardCard from "../../components/Cards/DashboardCard";
import RecentActivityCard from "../../components/Cards/RecentActivityCard";
import ProjectDistributionChart from "../../components/Chart/ProjectDistributionChart";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
    toDo: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const fetchDashboardStats = async () => {
    try {
        const response = await axiosInstance.get("/dashboard-stats");
        console.log("Dashboard Stats Response:", response.data);
        if (response.data) {
            setDashboardStats(response.data);
        }
    } catch (error) {
        console.error("Error fetching dashboard stats", error);
    }
};


  const fetchRecentActivities = async () => {
    try {
      const response = await axiosInstance.get("/recent-activities");
      if (response.data) {
        setRecentActivities(response.data);
      }
    } catch (error) {
      console.error("Error fetching recent activities", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get("/projects/get-projects");
      if (response.data) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    fetchDashboardStats();
    fetchRecentActivities();
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-200">
      <Navbar userInfo={userInfo} />
      <div className="flex flex-1 pt-12">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6 ml-56">
          {/* Dashboard Cards */}
          <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-8">
            <DashboardCard
              title="Assigned"
              number={dashboardStats.assigned}
              subTitle="tasks"
            />
            <DashboardCard
              title="In Progress"
              number={dashboardStats.inProgress}
              subTitle="tasks in progress"
            />
            <DashboardCard
              title="Completed"
              number={dashboardStats.completed}
              subTitle="tasks completed"
            />
            <DashboardCard
              title="To Do"
              number={dashboardStats.toDo}
              subTitle="tasks to do"
            />
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Recent Activities */}
            <div className="flex-1 flex flex-col h-[478px]">
              <RecentActivityCard activities={recentActivities} />
            </div>

            {/* Project Distribution Chart */}
            <div className="flex-1 flex flex-col h-[455px]">
              <ProjectDistributionChart data={projects} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
