import { h } from 'preact';
import './style.scss';
import { Preview } from './components/preview';
import { SubManagement } from './components/subManagement';
import {
  SubTitleManagementProvider,
  useSubTitleManagementContext,
} from './contexts/subTitle';
import { Wave } from './components/wave';

export const App = () => {
  const { exportData, onSave } = useSubTitleManagementContext();

  function handleSave() {
    onSave();
  }

  function handleExport() {
    exportData();
  }
  return (
    <>
      <SubTitleManagementProvider>
        <div class="translation-container">
          <span>
            <strong class="mr-1">Thai to Eng</strong>
            <small>switch</small>
          </span>
          <span>
            <button
              class="btn btn-outline-secondary"
              onClick={() => handleSave()}
            >
              Save
            </button>
            <button
              class="btn btn-outline-secondary"
              onClick={() => handleExport()}
            >
              Export
            </button>
          </span>
        </div>
        <hr />
        <div class="preview-center">
          <Preview />
          <SubManagement />
        </div>
        <Wave />
      </SubTitleManagementProvider>
    </>
  );
};
