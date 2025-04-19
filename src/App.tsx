import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme, makeStyles } from '@fluentui/react-components';
import { AuthProvider } from './auth/AuthContext';
import LoginButton from './components/LoginButton';
import AuthCallback from './components/AuthCallback';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
  },
});

const App: React.FC = () => {
  const styles = useStyles();

  return (
    <Router>
      <AuthProvider>
        <FluentProvider theme={webLightTheme}>
          <Routes>
            <Route
              path="/"
              element={
                <div className={styles.root}>
                  <h1>Welcome to React Fluent UI App</h1>
                  <LoginButton />
                </div>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </FluentProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 