import {RouterProvider} from "react-router-dom";
import routes from "../src/routes";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
   <RouterProvider router = {routes} />
  );
}

export default App;
