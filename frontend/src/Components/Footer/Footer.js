import React from 'react';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

const Footer = () => {
  return (
    <footer className="bg-gray-500 text-white mt-2 text-center text-lg-start">
      <section className="flex justify-center p-4 border-b-2 border-white-400">
        <div className="hidden lg:block me-5">
          <span className="font-medium">Get connected with us on social networks:</span>
        </div>
        <div>
          <Link to="https://www.facebook.com/YourPage" className="me-4 text-reset hover:text-blue-500" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f text-lg"></i>
          </Link>
          <Link to="https://twitter.com/YourPage" className="me-4 text-reset hover:text-blue-400" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter text-lg"></i>
          </Link>
          <Link to="https://www.google.com" className="me-4 text-reset hover:text-red-400" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-google text-lg"></i>
          </Link>
          <Link to="https://www.instagram.com/YourPage" className="me-4 text-reset hover:text-pink-400" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram text-lg"></i>
          </Link>
          <Link to="https://www.linkedin.com/company/YourPage" className="me-4 text-reset hover:text-blue-600" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin text-lg"></i>
          </Link>
          <Link to="https://github.com/YourPage" className="me-4 text-reset hover:text-black" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github text-lg"></i>
          </Link>
        </div>
      </section>

      <section className="text-white">
        <div className="container mx-auto text-center md:text-left p-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="mb-4">
              <h6 className="text-xl font-semibold mb-2">
                <i className="fas fa-gem mr-2"></i> FreelanceHub
              </h6>
              <p>
                Empowering Global Growth with Reliable Freelance Solutions</p>
              <p>we specialize in delivering professional and dependable freelance services tailored to your business needs. Whether you're a startup or an established enterprise, our goal is to help you scale, innovate, and reach new markets with ease.</p>
            </div>

            <div className="mb-4">
              <h6 className="text-xl font-semibold mb-2">Products</h6>
              <p><Link to="#!" className="text-reset hover:text-blue-400">Angular</Link></p>
              <p><Link to="#!" className="text-reset hover:text-blue-400">React</Link></p>
               <p><Link to="#!" className="text-reset hover:text-blue-400">Node Js</Link></p>
                <p><Link to="#!" className="text-reset hover:text-blue-400">Mongo db</Link></p>
              <p><Link to="#!" className="text-reset hover:text-blue-400">Vue</Link></p>
              <p><Link to="#!" className="text-reset hover:text-blue-400">Laravel</Link></p>
            </div>

            <div className="mb-4">
              <h6 className="text-xl font-semibold mb-2">Useful Links</h6>
              <p><Link to="#!" className="text-reset hover:text-blue-400">Pricing</Link></p>
              <p><Link to="#!" className="text-reset hover:text-blue-400">Settings</Link></p>
              <p><Link to="#!" className="text-reset hover:text-blue-400">Orders</Link></p>
              <p><Link to="#!" className="text-reset hover:text-blue-400">Help</Link></p>
            </div>

            <div>
              <h6 className="text-xl font-semibold mb-2">Contact</h6>
              <p><i className="fas fa-home mr-2"></i> New York, NY 10012, US</p>
              <p><i className="fas fa-envelope mr-2"></i> freelanceHub@gmail.com</p>
              <p><i className="fas fa-phone mr-2"></i> + 01 234 567 88</p>
              <p><i className="fas fa-print mr-2"></i> + 01 234 567 89</p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-800 p-4">
        <span>© 2021 Copyright: </span>
        <Link className="text-reset font-semibold hover:text-blue-400" to="https://yourcompany.com" target="_blank" rel="noopener noreferrer">
          freelanceHub.com
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
