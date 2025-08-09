// New LandingPage.jsx component
const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Smart Goal Planner
        </h1>
        <p className="text-gray-600 mb-8">
          Your personal tool for setting, tracking, and achieving your financial goals.
          Get started now to turn your dreams into reality.
        </p>
        <button
          onClick={onGetStarted}
          className="btn-primary w-full text-xl py-3"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default App;