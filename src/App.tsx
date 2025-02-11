import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./presentation/components/dashboard/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
