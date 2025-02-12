import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./presentation/components/dashboard/Dashboard";
import { container } from "./infrastructure/di/container";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Dashboard viewModel={container.dashboardViewModel} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
