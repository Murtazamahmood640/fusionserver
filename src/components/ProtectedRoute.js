import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ Component }) => {
    const rolesPermissions = {
        HRManager: [
            '/dashboard',
            '/faq',
            "/employee/createuser",
            "/employee/team",
            "/employee/manageprofile",
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            '/time/timeoffapproval',
            "/payroll/overview",
            "/payroll/addpayee",
            "/payroll/addpaymentrecords",
            "/payroll/payeelist",
            "/payroll/viewpaymentrecords",
            "/payroll/earnings",
            "/payroll/deductions",
            "/expense/addexpense",
            '/others/addfeedback',
            '/others/feedbacklist',
            '/others/chatsupport',  
            "/documents/adddocument",
            "/documents/viewdocuments",
            "/taskmanagement/taskstatus",
            "/taskmanagement/taskcalendar",
            // Add other Manager-specific routes if needed
        ],
        Admin: [
            "/dashboard",
            '/faq',
            "/payroll/employeeworkinghours",
            "/stakeholdermanagement/addStakeholder",
            "/stakeholdermanagement/manageStakeholder",
            "/time/calendar",
            "/time/clock",
            "/time/holidays",
            "/time/timeoffrequest",
            "/time/timeoffapproval",
            "/payroll/overview",
            "/payroll/addpayee",
            "/payroll/addpaymentrecords",
            "/payroll/payeelist",
            "/payroll/viewpaymentrecords",
            "/payroll/earnings",
            "/payroll/deductions",
            "/sales/overview",
            "/sales/addclient",
            "/sales/createinvoices",
            "/sales/addproduct",
            "/sales/viewclients",
            "/sales/viewinvoices",
            "/sales/viewproduct",
            "/projects/createproject",
            "/projects/assigntasks",
            "/employee/createuser",
            "/employee/team",
            "/documents/adddocument",
            "/documents/viewdocuments",
            "/expense/overview",
            "/expense/addexpense",
            "/expense/viewexpenses",
            "/expenseclaims/employees",
            "/expenseclaims/viewallclaims",
            "/projectplanning/create",
            "/projectplanning/overview",
            "/projects",
            "/projects/:projectId",
            "/projectplanning/milestones",
            "/projectplanning/viewmilestones",
            "/taskmanagement/assigntasks",
            "/taskmanagement/taskstatus",
            "/taskmanagement/mytasks",
            "/taskmanagement/taskcalendar",
            "/others/addfeedback",
            '/others/feedbacklist',
            "/others/chatsupport",
            "/billing/addcontractors",
            "/billing/addvendors",
            "/billing/viewcontractors",
            "/billing/viewvendors",
            "/billing/addbills",
            "/billing/viewbills",
            "/billing/mileageclaims",
            "/billing/viewmileageclaims",
            "/contacts",
            "/invoices",
            "/submitfeedbacks",
            "/earninganddeductions",
            "/view",
            "/viewInvoice/:id",
            "/project/:projectName",
            "/employee/manageprofile",
            "/main",
            "/barchart",
            "/pie",
            "/piechart",
            "/line",
            "/faq",
            "/geography",
            "/check",
            "/clockgrid"
        ],
        Employee: [
            '/dashboard',
            '/faq',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            "/expense/addexpense",
            '/others/addfeedback',
            '/others/chatsupport',
            "/taskmanagement/taskstatus",
            "/taskmanagement/taskcalendar",
        ],
        FinanceManager: [
            '/dashboard',
            '/faq',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            "/payroll/overview",
            "/payroll/addpayee",
            "/payroll/addpaymentrecords",
            "/payroll/payeelist",
            "/payroll/viewpaymentrecords",
            "/payroll/earnings",
            "/payroll/deductions",
            "/expense/overview",
            "/expense/addexpense",
            "/expense/viewexpenses",
            "/expenseclaims/employees",
            "/expenseclaims/viewallclaims",
            "/billing/addcontractors",
            "/billing/addvendors",
            "/billing/viewcontractors",
            "/billing/viewvendors",
            "/billing/addbills",
            "/billing/viewbills",
            "/billing/mileageclaims",
            "/billing/viewmileageclaims",
            '/others/addfeedback',
            '/others/chatsupport',
            "/taskmanagement/taskstatus",
            "/taskmanagement/taskcalendar"
        ],
        SalesManager: [
            '/dashboard',
            '/faq',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            "/payroll/overview",
            "/payroll/addpayee",
            "/payroll/addpaymentrecords",
            "/payroll/payeelist",
            "/payroll/viewpaymentrecords",
            "/payroll/earnings",
            "/payroll/deductions",
            "/sales/overview",
            "/sales/addclient",
            "/sales/createinvoices",
            "/sales/addproduct",
            "/sales/viewclients",
            "/sales/viewinvoices",
            "/sales/viewproduct",
            "/expenseclaims/employees",
            '/others/addfeedback',
            '/others/chatsupport',  "/taskmanagement/taskstatus",
            "/taskmanagement/taskcalendar"
        ],
        ProjectManager: [
            '/dashboard',
            '/faq',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            "/expenseclaims/employees",
            "/others/addfeedback",
            "/others/chatsupport",
            "/projectplanning/overview",
            '/projectplanning/create',
            '/projectplanning/milestones',
            // task
            "/taskmanagement/assigntasks",
            "/taskmanagement/taskstatus",
            "/taskmanagement/taskcalendar",
            
        ],
        TeamLead: [
            '/dashboard',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            '/expenseclaims/viewallclaims',
            '/expenseclaims/employees',
            '/others/addfeedback',
            '/faq',
            '/others/chatsupport',
            '/projectplanning/milestones',
            // task
            "/taskmanagement/assigntasks",
            "/taskmanagement/taskstatus",
            "/taskmanagement/taskcalendar",
            
        ]
    };


    const navigate = useNavigate();
    const location = useLocation();
    // const { isLoggedIn } = useAuth(); // Optional, if using context
    const isLoggedIn = localStorage.getItem("login");
    const getLoggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    console.log("getLoggedInUser", getLoggedInUser)
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
        else {
            const currentPath = location.pathname; // Get current route path
            const userRole = getLoggedInUser?.status; // Get the user's role
            localStorage.setItem("userRole", JSON.stringify(userRole))
            console.log("userRole", userRole)
            // Check if the user has permission for the current route
            const allowedRoutes = rolesPermissions[userRole] || [];
            if (!allowedRoutes.includes(currentPath)) {
                navigate("/unauthorized"); // Redirect if the user doesn't have access
            }
        }
    }, [isLoggedIn, navigate]);

    return (
        isLoggedIn ? <Component /> : null
    );
};

export default ProtectedRoute;
