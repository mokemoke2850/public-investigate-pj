import { createFileRoute } from '@tanstack/react-router';
import MuiPage from '../../pages/MuiPage';

export const Route = createFileRoute('/mui/')({
  component: () => <MuiPage />,
});
