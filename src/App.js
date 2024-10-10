import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Helmet } from "react-helmet"; // Import Helmet
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/contacts/account";
import Team from "./scenes/tables/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import BarChart from "./components/BarChart";
import CreateUser from "./scenes/form/CreateUser";
// import CreateProject from "./scenes/form/CreateProject";
import EmployeeInfo from "./scenes/form/EmployeeInfo";
import SubmitTimeoff from "./scenes/form/submittimeoff";
import CreateInvoice from "./scenes/form/CreateInvoice";
import Feedback from "./scenes/form/AddFeedback";
import Doc from "./scenes/form/UploadDocument";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import PieChart from "./components/PieChart";
import FAQ from "./scenes/faq/index";
import Login from "./scenes/Login/login";
import Geography from "./scenes/geography";
import SubmitFeedbacks from "./scenes/tables/SubmitFeebacks";
import AllDoc from "./scenes/tables/AllDocuments";
import Salary from "./scenes/tables/EarningAndDeductions";
import ManageException from "./scenes/tables/ManageExceptions";
import MainComponent from "./scenes/tables/Main";
import Clock from "./scenes/tables/Clock";
import View from "./scenes/tables/ViewInvoice";
import ViewOne from "./scenes/tables/viewoneinvoice";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Account from "./scenes/contacts/account";
import AssignTasks from "./scenes/form/AssignTasks";
import ProjectTaskPage from "./scenes/form/ProjectTaskPage";
// import TaskStatus from "./scenes/tables/TaskStatus";
// import MyTasks from "./scenes/tables/MyTasks";
import TimeoffApp from "./scenes/tables/TimeOffApp";
import Test from "./components/Test";
import LineChart from "./components/LineChart";
import ClockGrid from "./scenes/tables/Clockgrid";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/ChatBot";
import Overview from "./scenes/Sales/Overview";
import AddInvoice from "./scenes/Sales/AddInvoice";
import AddClient from "./scenes/Sales/AddClient";
import ClientsList from "./scenes/Sales/ListofClients";
import AddProduct from "./scenes/Sales/AddProduct";
import ListofInvoices from "./scenes/Sales/ListofInvoices";
import ProductList from "./scenes/Sales/productList";
import AddPayee from "./scenes/Payroll/AddPayee";
import AddPayment from "./scenes/Payroll/AddPayment";
import PayeeList from "./scenes/Payroll/PayeeList";
import PaymentList from "./scenes/Payroll/PaymentList";
import Deductions from "./scenes/Payroll/deduction";
import Earnings from "./scenes/Payroll/earning";
import PayrollDashboard from "./scenes/Payroll/PayrollOverview"
import AddContractor from "./scenes/Billing/AddContractor"
import AddVendor from "./scenes/Billing/AddVendor"
import ContractorList from "./scenes/Billing/ContractorList"
import VendorList from "./scenes/Billing/VendorList"
import BillList from "./scenes/Billing/BillList"
import AddBill from "./scenes/Billing/AddBill"
import ExpenseClaims from "./scenes/Expenseclaims/AddExpenseClaims"
import ViewClaims from "./scenes/Expenseclaims/ViewClaimedExpense"
import MilageClaims from "./scenes/Billing/EmployeeMilageClaims"
import MileageClaimsList from "./scenes/Billing/ViewMilageClaims"
import  AddExpenses  from "./scenes/Expenses/AddExpenses";
import ViewExpenses from "./scenes/Expenses/ViewExpenses";
import ExpenseOverview from "./scenes/Expenses/ExpenseOverview";
import CreateProject from "./scenes/ProjectPlanning/createproject";
import ProjectList from "./scenes/ProjectPlanning/ProjectList";
import ProjectDetails from "./scenes/ProjectPlanning/ProjectDetails";
import CreateMilestone from "./scenes/ProjectPlanning/Milestone"
import MilestonesList from "./scenes/ProjectPlanning/ViewMilestones"
import AssignTask from "./scenes/TaskManagement/AssignTasks";
import TaskStatus from "./scenes/TaskManagement/TaskStatus";
import MyTasks from "./scenes/TaskManagement/MyTasks";
import TaskCalendar from "./scenes/TaskManagement/TaskCalender";
import ProjectOverview from "./scenes/ProjectPlanning/projectoverview";
import ForgotPassword from "./scenes/Login/ForgotPassword";
import ResetPassword from "./scenes/Login/ResetPassword";
import AddStakeholder from "./scenes/StakeholderManagement/AddStakeholder";
import ManageStakeholder from "./scenes/StakeholderManagement/ManageStakeholder";
import EmployeeWorkTimePage from "./scenes/Payroll/EmployeeWorkingTime";
// import GeneratePerformanceReport from "./scenes/Employeeperformance/GeneratePerformanceReport ";
// import CreateGoal from "./scenes/Employeeperformance/CreateGoal ";
// import CreatePerformanceReview from "./scenes/Employeeperformance/CreatePerformanceReview ";
// import CreateTraining from "./scenes/Employeeperformance/CreateTraining ";
import ViewFeedback from "./scenes/tables/ViewFeedback";
import CreateAnnouncements from "./scenes/Announcements/CreateAnnoucements";
import ManageAnnouncements from "./scenes/Announcements/ManageAnnouncements";
import NewsFeed from "./scenes/Announcements/NewsFeed";
import ViewAnnouncements from "./scenes/Announcements/ViewAnnouncement";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const logoutTime = 15 * 60 * 1000;  // 15 minutes
 
  let logoutTimer;
 
  // Log out function
  const logout = () => {
    // Clear user session data (like JWT token or session info)
    localStorage.removeItem('login');
    // Redirect to login page
    navigate('/');
  };
 
  // Reset logout timer on user activity
  const resetLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(logout, logoutTime);
  };
 
  useEffect(() => {
    resetLogoutTimer();
 
    window.addEventListener('mousemove', resetLogoutTimer);
    window.addEventListener('keypress', resetLogoutTimer);
 
    return () => {
      window.removeEventListener('mousemove', resetLogoutTimer);
      window.removeEventListener('keypress', resetLogoutTimer);
    };
  }, []);
  const isLoginPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/" || location.pathname === "/forgot-password" || location.pathname.startsWith("/reset-password");

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Helmet>
          <title>{`Fusion HR - ${location.pathname.split('/')[1] || 'Home'}`}</title> {/* Dynamic Title */}
        </Helmet>
        <div className="app">
          {/* Conditionally render Sidebar only if not on login, forgot-password, or reset-password pages */}
          {!isAuthPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {/* Conditionally render Topbar only if not on login, forgot-password, or reset-password pages */}
            {!isAuthPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              {/* Authentication routes */}
              <Route path="/" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} />} />
              
              {/* Time and Attendance Routes */}
              <Route path="/time/calendar" element={<ProtectedRoute Component={Calendar} />} />
              <Route path="/time/clock" element={<ProtectedRoute Component={Clock} />} />
              <Route path="/time/holidays" element={<ProtectedRoute Component={ManageException} />} />
              <Route path="/time/timeoffrequest" element={<ProtectedRoute Component={SubmitTimeoff} />} />
              <Route path="/time/timeoffapproval" element={<ProtectedRoute Component={TimeoffApp} />} />
              
              {/* Payroll Routes */}
              <Route path="/payroll/overview" element={<ProtectedRoute Component={PayrollDashboard} />} />
              <Route path="/payroll/addpayee" element={<ProtectedRoute Component={AddPayee} />} />
              <Route path="/payroll/addpaymentrecords" element={<ProtectedRoute Component={AddPayment} />} />
              <Route path="/payroll/payeelist" element={<ProtectedRoute Component={PayeeList} />} />
              <Route path="/payroll/viewpaymentrecords" element={<ProtectedRoute Component={PaymentList} />} />
              <Route path="/payroll/earnings" element={<ProtectedRoute Component={Earnings} />} />
              <Route path="/payroll/deductions" element={<ProtectedRoute Component={Deductions} />} />
              <Route path="/payroll/employeeworkinghours" element={<ProtectedRoute Component={EmployeeWorkTimePage} />} />
              
              {/* Sales Routes */}
              <Route path="/sales/overview" element={<ProtectedRoute Component={Overview} />} />
              <Route path="/sales/addclient" element={<ProtectedRoute Component={AddClient} />} />
              <Route path="/sales/createinvoices" element={<ProtectedRoute Component={AddInvoice} />} />
              <Route path="/sales/addproduct" element={<ProtectedRoute Component={AddProduct} />} />
              <Route path="/sales/viewclients" element={<ProtectedRoute Component={ClientsList} />} />
              <Route path="/sales/viewinvoices" element={<ProtectedRoute Component={ListofInvoices} />} />
              <Route path="/sales/viewproduct" element={<ProtectedRoute Component={ProductList} />} />

             {/* stakeholdermanagement */}
             <Route path="/stakeholdermanagement/addStakeholder" element={<ProtectedRoute Component={AddStakeholder} />} />
              <Route path="/stakeholdermanagement/manageStakeholder" element={<ProtectedRoute Component={ManageStakeholder} />} />

              {/* Projects Routes */}
              <Route path="/projects/createproject" element={<ProtectedRoute Component={CreateProject} />} />
              <Route path="/projects/assigntasks" element={<ProtectedRoute Component={AssignTasks} />} />
              {/* <Route path="/projects/taskstatus" element={<ProtectedRoute Component={TaskStatus} />} /> */}
              {/* <Route path="/projects/mytasks" element={<ProtectedRoute Component={MyTasks} />} /> */}
              
              {/* Employee Data Routes */}
              <Route path="/employee/createuser" element={<ProtectedRoute Component={CreateUser} />} />
              <Route path="/employee/team" element={<ProtectedRoute Component={Team} />} />

              {/* Documents Routes */}

              <Route path="/documents/adddocument" element={<ProtectedRoute Component={Doc} />} />
              <Route path="/documents/viewdocuments" element={<ProtectedRoute Component={AllDoc} />} />

              {/*  Expenses */}

              <Route path="/expense/overview" element={<ProtectedRoute Component={ExpenseOverview} />} />
              <Route path="/expense/addexpense" element={<ProtectedRoute Component={AddExpenses} />} />
              <Route path="/expense/viewexpenses" element={<ProtectedRoute Component={ViewExpenses} />} />
             
              {/*  Expense Claims */}

              <Route path="/expenseclaims/employees" element={<ProtectedRoute Component={ExpenseClaims} />} />
              <Route path="/expenseclaims/viewallclaims" element={<ProtectedRoute Component={ViewClaims} />} />
         
              {/*  Project Planning */}
              <Route path="/projectplanning/overview" element={<ProtectedRoute Component={ProjectOverview} />} />
              <Route path="/projectplanning/create" element={<ProtectedRoute Component={CreateProject} />} />
              <Route path="/projects" element={<ProtectedRoute Component={ProjectList} />} />
              <Route path="/projects/:projectId" element={<ProtectedRoute Component={ProjectDetails} />} />

              <Route path="/projectplanning/milestones" element={<ProtectedRoute Component={CreateMilestone} />} />
              <Route path="/projectplanning/viewmilestones" element={<ProtectedRoute Component={MilestonesList} />} />

              {/* Task Managmenet Routes */}

              <Route path="/taskmanagement/assigntasks" element={<ProtectedRoute Component={AssignTask } />} />
              <Route path="/taskmanagement/taskstatus" element={<ProtectedRoute Component={TaskStatus } />} />
              <Route path="/taskmanagement/mytasks" element={<ProtectedRoute Component={MyTasks } />} />
              <Route path="/taskmanagement/taskcalendar" element={<ProtectedRoute Component={TaskCalendar } />} />

              {/* Performance Managmenet Routes

              <Route path="/employeeperformance/generateperformancereport" element={<ProtectedRoute Component={GeneratePerformanceReport } />} />
              <Route path="/employeeperformance/creategoal" element={<ProtectedRoute Component={CreateGoal } />} />
              <Route path="/employeeperformance/createperformancereview" element={<ProtectedRoute Component={CreatePerformanceReview } />} />
              <Route path="/employeeperformance/createtraining" element={<ProtectedRoute Component={CreateTraining } />} /> */}


              {/* Feedback Routes */}

              <Route path="/others/addfeedback" element={<ProtectedRoute Component={Feedback} />} />
              <Route path="/others/feedbacklist" element={<ProtectedRoute Component={ViewFeedback} />} />
              
              {/* Messages Routes */}
              <Route path="/others/chatsupport" element={<ProtectedRoute Component={Chatbot} />} />
              

              {/* billing routes */}
              <Route path="/billing/addcontractors" element={<ProtectedRoute Component={AddContractor} />} />
              <Route path="/billing/addvendors" element={<ProtectedRoute Component={AddVendor} />} />
              <Route path="/billing/viewcontractors" element={<ProtectedRoute Component={ContractorList} />} />
              <Route path="/billing/viewvendors" element={<ProtectedRoute Component={VendorList} />} />
              <Route path="/billing/addbills" element={<ProtectedRoute Component={AddBill} />} />
              <Route path="/billing/viewbills" element={<ProtectedRoute Component={BillList} />} />
              <Route path="/billing/mileageclaims" element={<ProtectedRoute Component={MilageClaims} />} />
              <Route path="/billing/viewmileageclaims" element={<ProtectedRoute Component={MileageClaimsList} />} />

              {/* Other Routes */}
              <Route path="/contacts" element={<ProtectedRoute Component={Contacts} />} />
              <Route path="/invoices" element={<ProtectedRoute Component={Invoices} />} />
              <Route path="/submitfeedbacks" element={<ProtectedRoute Component={SubmitFeedbacks} />} />
              <Route path="/earninganddeductions" element={<ProtectedRoute Component={Salary} />} />
              <Route path="/view" element={<ProtectedRoute Component={View} />} />
              <Route path="/viewInvoice/:id" element={<ProtectedRoute Component={ViewOne} />} />
              <Route path="/project/:projectName" element={<ProtectedRoute Component={ProjectTaskPage} />} />
              <Route path="/employee/manageprofile" element={<ProtectedRoute Component={Account} />} />
              <Route path="/main" element={<ProtectedRoute Component={MainComponent} />} />
              <Route path="/barchart" element={<ProtectedRoute Component={BarChart} />} />
              <Route path="/pie" element={<ProtectedRoute Component={Pie} />} />
              <Route path="/piechart" element={<ProtectedRoute Component={PieChart} />} />
              <Route path="/line" element={<ProtectedRoute Component={LineChart} />} />
              <Route path="/faq" element={<ProtectedRoute Component={FAQ} />} />
              <Route path="/geography" element={<ProtectedRoute Component={Geography} />} />
              <Route path="/check" element={<ProtectedRoute Component={Test} />} />
              <Route path="/clockgrid" element={<ProtectedRoute Component={ClockGrid} />} />
              
              <Route path="/announcements/createannoucements" element={<ProtectedRoute Component={CreateAnnouncements} />} />
              <Route path="/announcements/viewannouncement" element={<ProtectedRoute Component={ViewAnnouncements} />} />
              <Route path="/announcements/manageannouncements" element={<ProtectedRoute Component={ManageAnnouncements} />} />
              <Route path="/announcements/newsfeed" element={<ProtectedRoute Component={NewsFeed} />} />



            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
