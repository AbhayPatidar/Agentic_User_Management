import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UsersPage from "./pages/UsersPage";
import UsersListPage from "./pages/UsersListPage";
import CreateChatPage from "./pages/CreateChatPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/"      element={<UsersPage />} />
          <Route path="/users" element={<UsersListPage />} />
          <Route path="/chat"  element={<CreateChatPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
