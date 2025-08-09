import React from 'react';
import {
  AiOutlineLineChart,
  AiOutlineStar,
  AiOutlineUser,
} from 'react-icons/Ai'; // Corrected import path with a capital 'A'
import { AiOutlineArrowRight } from "react-icons/ai"; // Example of another correct import

const LandingPage = ({ onSignInClick, onSignUpClick }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">
            SmartGoal Planner
          </h1>
          <nav>
            <button
              onClick={onSignInClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition duration-300 mr-2"
            >
              Sign In
            </button>
            <button
              onClick={onSignUpClick}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition duration-300"
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Achieve Your Financial Goals with a Plan
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Set, track, and manage your savings goals effortlessly with our smart
            goal planner.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onSignUpClick}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={onSignInClick}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg border border-indigo-600 hover:bg-indigo-50 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Learn More
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mt-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center items-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-4">
              <AiOutlineLineChart size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Track Your Progress
            </h3>
            <p className="text-gray-600">
              Easily monitor your savings journey and stay motivated as you see
              how far you've come.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center items-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-4">
              <AiOutlineStar size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Set SMART Goals
            </h3>
            <p className="text-gray-600">
              Create specific, measurable, achievable, relevant, and time-bound
              goals.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center items-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-4">
              <AiOutlineUser size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Get Personalized Insights
            </h3>
            <p className="text-gray-600">
              Receive tips and suggestions to help you overcome obstacles.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 SmartGoal Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

