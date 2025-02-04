import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { store } from './store/store';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import theme from './theme';
import { useEffect } from 'react';
import { loginSuccess } from './store/authSlice';

export const App = () => {
  useEffect(() => {
    // Try to restore auth state
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      store.dispatch(loginSuccess(JSON.parse(savedUser)));
    }
  }, []);

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </Provider>
  );
};

export default App;
