// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignupForm } from "./pages/auth/Signup";
import { SigninForm } from "./pages/auth/Signin";
import { Books } from "./pages/Books";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="pt-20 md:pt-28">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/signin" element={<SigninForm />} />
            <Route path="/books" element={<Books />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
