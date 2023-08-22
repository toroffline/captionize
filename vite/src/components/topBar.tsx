import { h } from 'preact';
import { useSubTitleManagementContext } from '../contexts/subTitle';

export const TopBar = () => {
  const { toggleInsertSpeaker, setToggleInsertSpeaker, exportData, onSave } =
    useSubTitleManagementContext();

  function handleSave() {
    onSave();
  }

  function handleExport() {
    exportData();
  }

  return (
    <>
      <div class="translation-container">
        <span>
          <strong class="mr-1">Thai to Eng</strong>
          <small>switch</small>
        </span>
        <div class="ml-auto">
          <span class="form-check form-switch form-check-inline">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              checked={toggleInsertSpeaker}
              onClick={() => setToggleInsertSpeaker(!toggleInsertSpeaker)}
            />
            <label class="form-check-label" for="flexSwitchCheckDefault">
              {/* Insert speaker */}
              Edit mode
            </label>
          </span>
          <button
            class="btn btn-outline-secondary"
            onClick={() => handleSave()}
          >
            Save
          </button>
          <button
            class="btn btn-outline-secondary ml-1"
            onClick={() => handleExport()}
          >
            Export
          </button>
        </div>
      </div>
      <hr class="mb-0" />
    </>
  );
};
