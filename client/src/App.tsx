import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginView from './pages/new/login';
// import Dashboard from './pages/dashboard';
import Dashboard from './pages/new/dashboard';
import Flashcard from './pages/flashcard';
import { ProtectedRoute } from './components/auth/authContext'; 
import ThemeProvider from './theme';
import Layout from './layout'; 
import { Chat } from './pages/chat';
import { Quiz } from './pages/quiz';
import SummaryComponent from './pages/new/summary';
import Resource from './pages/new/resource';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/flashcards/:resourceId" element={<Flashcard />} />
              <Route path="/chat/:resourceId" element={<Chat />} />
              <Route path="/quiz/:resourceId" element={<Quiz />} />
              <Route path="/summary/:resourceId" element={<SummaryComponent />} />
              <Route path="/resource" element={<Resource/>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
