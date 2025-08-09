import React from 'react';
import { HeroiconsOutlineShieldCheck } from '@heroicons/react/outline'; // This import is not available. Please use a library like `react-icons` if you need icons. Or, replace this with a temporary SVG icon.
import {
  AiOutlineLineChart,
  AiOutlineStar,
  AiOutlineUser,
} from 'react-icons/ai'; // using react-icons for a placeholder

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
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Achieve Your Goals Smarter, Not Harder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plan, track, and crush your goals with a powerful, intuitive tool
            that keeps you motivated and on track.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-center items-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto mb-4">
              <AiOutlineLineChart size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Track Your Progress
            </h3>
            <p className="text-gray-600">
              Visualize your journey and stay motivated as you see how far you've
              come.
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
              Create specific, measurable, achievable, relevant, and
              time-bound goals.
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
          <p>&copy; {new Date().getFullYear()} SmartGoal Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
