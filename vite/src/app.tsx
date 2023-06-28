import { h } from 'preact';
import './style.scss';
import { Preview } from './components/preview';
import { SubManagement } from './components/subManagement';
import {
  SubTitleManagementProvider,
  useSubTitleManagementContext,
} from './contexts/subTitle';
import { Wave } from './components/wave';
import { TopBar } from './components/topBar';

export const App = () => {
  return (
    <>
      <SubTitleManagementProvider>
        <TopBar />
        <div class="preview-center">
          <Preview />
          <SubManagement />
        </div>
        <Wave />
      </SubTitleManagementProvider>
    </>
  );
};
