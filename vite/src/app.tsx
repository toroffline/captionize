import { h } from 'preact'
import './style.scss'
import { Preview } from './components/preview'
import { SubManagement } from './components/subManagement'
import { SubTitleManagementProvider } from './contexts/Subtitle'

export const App = () => {
  return (
    <div>
      <div class="d-flex flex-column">
        <SubTitleManagementProvider>
          <Preview />
          <SubManagement />
        </SubTitleManagementProvider>
      </div>
    </div>
  )
}
