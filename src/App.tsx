import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { MobileScrollToTop } from './routes/MobileScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <MobileScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
