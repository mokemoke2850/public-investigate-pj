import Router from './components/routes/Router';
import useAxiosAuth from './hooks/useAxiosAuth';

function App() {
  useAxiosAuth();
  return <Router />;
}

export default App;
