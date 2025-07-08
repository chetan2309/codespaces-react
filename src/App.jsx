import React, { useState } from 'react';

// Main App Component: Manages navigation and state
export default function App() {
  // State to track the current user. null means logged out.
  const [user, setUser] = useState(null);
  // State to manage which page is currently visible.
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'profile', 'settings'

  // Mock user data
  const mockUser = {
    id: 'u123',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    bio: 'Loves building innovative testing solutions with AI.',
    settings: {
      notifications: true,
      theme: 'dark',
    },
  };

  // --- Handlers ---
  const handleLogin = (username) => {
    console.log(`${username} logged in successfully.`);
    setUser(mockUser);
    setCurrentPage('profile'); // Navigate to profile after login
  };

  const handleLogout = () => {
    console.log('User logged out.');
    setUser(null);
    setCurrentPage('login'); // Navigate to login after logout
  };

  const navigateTo = (page) => {
    if (user) { // Only allow navigation if logged in
      setCurrentPage(page);
    } else {
      alert("Please login to access other pages.");
    }
  };

  // --- Render Logic ---
  const renderPage = () => {
    if (!user || currentPage === 'login') {
      return <LoginForm onLogin={handleLogin} />;
    }
    switch (currentPage) {
      case 'profile':
        return <UserProfile user={user} />;
      case 'settings':
        return <Settings settings={user.settings} />;
      default:
        return <LoginForm onLogin={handleLogin} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header user={user} onNavigate={navigateTo} onLogout={handleLogout} currentPage={currentPage} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          {renderPage()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// --- Components ---

// Header Component: Displays navigation and user status
function Header({ user, onNavigate, onLogout, currentPage }) {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">TestApp</div>
        {user && (
          <div className="flex items-center space-x-4">
            <NavButton text="Profile" onClick={() => onNavigate('profile')} isActive={currentPage === 'profile'} />
            <NavButton text="Settings" onClick={() => onNavigate('settings')} isActive={currentPage === 'settings'} />
            <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

// Navigation Button Component
function NavButton({ text, onClick, isActive }) {
    const activeClasses = "bg-blue-500 text-white";
    const inactiveClasses = "bg-gray-200 hover:bg-gray-300 text-gray-700";
    return (
        <button onClick={onClick} className={`font-bold py-2 px-4 rounded-lg transition duration-300 ${isActive ? activeClasses : inactiveClasses}`}>
            {text}
        </button>
    );
}


// LoginForm Component: Handles user authentication
function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }
    setError('');
    onLogin(username);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 text-lg">
          Sign In
        </button>
      </form>
      <div className="text-center mt-4">
        <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
      </div>
    </div>
  );
}

// UserProfile Component: Displays user information
function UserProfile({ user }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">User Profile</h2>
      <div className="space-y-4">
        <InfoField label="Name" value={user.name} />
        <InfoField label="Email" value={user.email} />
        <InfoField label="Bio" value={user.bio} />
      </div>
      <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        Edit Profile
      </button>
    </div>
  );
}

// Settings Component: Allows user to change application settings
function Settings({ settings }) {
    const [notifications, setNotifications] = useState(settings.notifications);
    const [theme, setTheme] = useState(settings.theme);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Application Settings</h2>
            <div className="space-y-6">
                {/* Notification Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium text-gray-700">Enable Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {/* Theme Selector */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium text-gray-700">Interface Theme</span>
                    <select value={theme} onChange={(e) => setTheme(e.target.value)} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                        <option value="system">System Default</option>
                    </select>
                </div>
            </div>
             <button className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Save Changes
            </button>
        </div>
    );
}

// Reusable Input Field Component
function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// Reusable Info Display Field
function InfoField({ label, value }) {
    return (
        <div>
            <p className="text-sm font-bold text-gray-500">{label}</p>
            <p className="text-lg text-gray-800">{value}</p>
        </div>
    );
}

// Footer Component
function Footer() {
    return (
        <footer className="text-center p-4 mt-8">
            <p className="text-sm text-gray-500">&copy; 2025 TestApp Inc. All rights reserved.</p>
        </footer>
    );
}