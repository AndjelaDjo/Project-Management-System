import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import Project from "./pages/Project/Project";
import Task from "./pages/Task/Task";
import Team from "./pages/Team/Team";
import ProjectDetails from "./pages/Project/ProjectDetails";
import TeamDetails from "./pages/Team/TeamDetails";
import TaskDetails from "./pages/Task/TaskDetails";

const routes = (
    <Router>
        <Routes>
            <Route path='/dashboard' exact element={<Home />} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/signUp' exact element={<SignUp />} />
            <Route path='/projects' exact element={<Project />} />
            <Route path='/tasks' exact element={<Task />} />
            <Route path='/teams' exact element={<Team />} />
            <Route path="/project-details/:id" exact element={<ProjectDetails />} />
            <Route path="/team-details/:id" exact element={<TeamDetails />} />
            <Route path="/task-details/:id" exact element={<TaskDetails />} />
            
        </Routes>
    </Router>
);

const App = () => {
    return (
        <div>
            {routes}
        </div>
    );
};

export default App;
