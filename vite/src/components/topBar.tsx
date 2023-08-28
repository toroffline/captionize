import { h } from 'preact';
import { useSubTitleManagementContext } from '../contexts/subTitle';
import { useState } from 'preact/hooks';
import { Toast, ToastBody, ToastContainer } from 'react-bootstrap';

const hideTimeout = 3000;
const alertPosition = 'top-end';

export const TopBar = () => {
  const { setToggleInsertSpeaker, exportData, onSave } =
    useSubTitleManagementContext();
  const [popSaveSuccess, setPopSaveSuccess] = useState(false);
  const [popSaveFailed, setPopSaveFailed] = useState(false);

  async function handleSave() {
    const isSuccess = await onSave();
    if (isSuccess) {
      setPopSaveSuccess(true);
      setTimeout(() => {
        setPopSaveSuccess(false);
      }, hideTimeout);
    } else {
      setPopSaveFailed(true);
      setTimeout(() => {
        setPopSaveFailed(false);
      }, hideTimeout);
    }
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
              // checked={toggleInsertSpeaker}
              onClick={() => setToggleInsertSpeaker()}
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

      <ToastContainer position={alertPosition}>
        <Toast show={popSaveSuccess}>
          <ToastBody>Save success 🎉</ToastBody>
        </Toast>
      </ToastContainer>

      <ToastContainer position={alertPosition}>
        <Toast show={popSaveFailed}>
          <ToastBody>Save failed ❌</ToastBody>
        </Toast>
      </ToastContainer>
    </>
  );
};
