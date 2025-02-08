import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 mt-8 fixed bottom-0">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo and Links */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl">Nevzat Atalay</span>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="flex space-x-6">
          <Link href="/about" className="text-gray-400 hover:text-white transition">
            About
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-white transition">
            Contact
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-white transition">
            Privacy Policy
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <Link href="https://twitter.com" className="text-gray-400 hover:text-white transition">
            <i className="fab fa-twitter"></i> {/* Replace with a Twitter icon */}
          </Link>
          <Link href="https://github.com" className="text-gray-400 hover:text-white transition">
            <i className="fab fa-github"></i> {/* Replace with a GitHub icon */}
          </Link>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-gray-400 mt-4">
        <p>&copy; {new Date().getFullYear()} Nevzat Atalay. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
