import { createBrowserRouter,Navigate} from "react-router-dom";
import  Login from "./Layout/Authentication";
import Register from "./Layout/Register";
import Clientdashboard from "./Components/Client/clientdashboard";
import Admindashboard from "./Components/Admin/admindashboard";
import Freelancerdashboard  from "./Components/Freelancer/freelancerdashboard";
import Bid from "./Components/Freelancer/Bid";
import Layout from "./Layout/Layout";
import Jobs from  "./Components/Jobs/Jobs";
import AddJob from "./Components/Jobs/AddJob";
import ProposalList from "./Components/Client/ProposalList";
import Proposal from "./Components/Freelancer/MyProposal";
import Home from "./Components/Home";
import Freelancerprofile from "./Components/Freelancer/freelancerProfile";
import Clientprofile from "./Components/Client/clientProfile";
import  MyProposal  from "./Components/Freelancer/MyProposal";
import Chat from "./Components/Chat/Chat";
import AcceptBid from "./Components/Client/AcceptBid";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./Components/Payment/Payment";
import AddReview from "./Components/Client/AddReview";
import ClientReport from "./Components/Admin/clientReport";
import FreelancerReport from "./Components/Admin/freelancerReport";
import JobReport from "./Components/Admin/jobReport";
import BidList from "./Components/Freelancer/BidList";
import JobProfile  from "./Components/Jobs/JobProfile";


const stripePromise = loadStripe("pk_test_51RD96gR3dnpCBBb9NWyHF9GbJzo3RXxzuDEsv0KS0PTpUWuo6oQc5b2iBqcrGLNC5ZV50wIA6pKHUyAEoq0zfbt300gCcdhIzN");


const isAuthenticated= ()=>{
    try {
    const token = localStorage.getItem('@token');
    const user = localStorage.getItem('@user');

  
   
    if(user && token){
        return true;
    }
}catch (error) {
        console.error("Error parsing JSON:", error);
        return false;
    }
   
};

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? <>{element}</> : <Navigate to="/authentication/login" />;
};

const FallbackRoute = () => {
    return isAuthenticated() ? <Navigate to="/" /> : <Navigate to="/authentication/login" />;
}


const routes = createBrowserRouter([
   { path: "/Home", element: <Home/> },
    { path: "/authentication/login", element: <Login /> },
    { path: "/authentication/register", element: <Register /> },
    { path: "/", element: <Home/> },
    {  path: "/Admin/admindashboard",element: <ProtectedRoute element={<Layout><Admindashboard /></Layout>} />, },
    {  path: "/Admin/clientReport",element: <ProtectedRoute element={<Layout><ClientReport/></Layout>} />, },
    {  path: "/Admin/jobReport",element: <ProtectedRoute element={<Layout><JobReport /></Layout>} />, },
    {  path: "/Jobs/JobProfile",element:<ProtectedRoute element={<Layout><JobProfile /></Layout>} />,},
    {  path: "/Admin/freelancerReport",element: <ProtectedRoute element={<Layout><FreelancerReport /></Layout>} />, },
    {  path: "/Client/clientdashboard",element: <ProtectedRoute element={<Layout><Clientdashboard /></Layout>} />, },
    {  path: "/Client/AddReview",element: <ProtectedRoute element={<Layout><AddReview /></Layout>} />, },
    {  path: "/Freelancer/freelancerdashboard",element: <ProtectedRoute element={<Layout><Freelancerdashboard /></Layout>} />, },
    {  path: "/Freelancer/freelancerProfile",element: <ProtectedRoute element={<Layout><Freelancerprofile /></Layout>} />, },
    {  path: "/Client/clientProfile",element: <ProtectedRoute element={<Layout><Clientprofile /></Layout>} />, },
    {  path: "/Client/AcceptBid",element: <ProtectedRoute element={<Layout><AcceptBid /></Layout>} />, },
    {  path: "/Client/ProposalList", element : <ProtectedRoute element={<Layout><ProposalList/></Layout> } />,},
    {  path: "/Payment/:bidId",element: (<ProtectedRoute element={<Elements stripe={stripePromise}><Layout><Payment /></Layout></Elements>}/>), },  
    {  path: "/Jobs/Jobs",element: <ProtectedRoute element={<Layout><Jobs /></Layout>} />, },
    {   path:"/Jobs/AddJob",element: <ProtectedRoute element={<Layout><AddJob/></Layout>}/>,},
    {  path: "/Freelancer/Bid", element : <ProtectedRoute element={<Layout><Bid/></Layout> } />,},
    {  path: "/Freelancer/Proposal", element : <ProtectedRoute element={<Layout><Proposal/></Layout> } />,},
    {  path: "/Freelancer/BidList", element : <ProtectedRoute element={<Layout><BidList/></Layout> } />,},
    {  path: "/Freelancer/MyProposal", element : <ProtectedRoute element={<Layout><MyProposal/></Layout> } />,},
    {  path: "/Chat/Chat/:receiverId", element: <ProtectedRoute element={<Layout><Chat /></Layout>} />,},
    { path: "*", element : <Navigate to="/authentication/login" />}, 
   
  ]);

export default routes;




