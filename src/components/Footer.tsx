import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-effect py-16 mt-12 corner-shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Connect</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Facebook</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">&copy; 2024 <span className="text-red-500 font-semibold">YOO</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 