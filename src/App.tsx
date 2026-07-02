import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { MobileScrollToTop } from './routes/MobileScrollToTop';
import { devComponentAttrs } from '@/lib/devtools';

function App() {
  return (
    <BrowserRouter {...devComponentAttrs('App')}>
      <MobileScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
