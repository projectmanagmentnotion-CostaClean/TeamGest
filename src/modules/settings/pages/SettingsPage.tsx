import { startTransition, useState } from 'react'
import { PageHeader } from '../../../components/ui/PageHeader'
import { WarningBanner } from '../../../components/ui/WarningBanner'
import type { AppSettingsSectionId } from '../../../domain/settings/appSettings.types'
import { listAuditEntries } from '../../../infrastructure/audit/auditRepository'
import { getStorageTools } from '../../../infrastructure/repositoryFactory'
import { AuditLogPanel } from '../components/AuditLogPanel'
import { AuditSettingsPanel } from '../components/AuditSettingsPanel'
import { BackupExportPanel } from '../components/BackupExportPanel'
import { CompanySettingsPanel } from '../components/CompanySettingsPanel'
import { DataSafetyChecklist } from '../components/DataSafetyChecklist'
import { DataSafetySettingsPanel } from '../components/DataSafetySettingsPanel'
import { DisplaySettingsPanel } from '../components/DisplaySettingsPanel'
import { HourReviewSettingsPanel } from '../components/HourReviewSettingsPanel'
import { HoursPaymentSettingsPanel } from '../components/HoursPaymentSettingsPanel'
import { ImportDataPanel } from '../components/ImportDataPanel'
import { LocalDataWarning } from '../components/LocalDataWarning'
import { QuickEntrySettingsPanel } from '../components/QuickEntrySettingsPanel'
import { ResetDemoDataPanel } from '../components/ResetDemoDataPanel'
import { ServiceSettingsPanel } from '../components/ServiceSettingsPanel'
import { SettingsHealthPanel } from '../components/SettingsHealthPanel'
import { SettingsSectionNav } from '../components/SettingsSectionNav'
import { StorageHealthPanel } from '../components/StorageHealthPanel'
import { StorageOverview } from '../components/StorageOverview'
import { SystemSettingsPanel } from '../components/SystemSettingsPanel'
import {
  getAppSettingsSnapshot,
  getSettingsSectionWarnings,
  resetAppSettings,
  updateAppSettings,
} from '../services/appSettingsService'
import { getDataSafetyChecklist, getLocalDataRiskLevel } from '../services/dataSafety'
import {
  getLocalSettingsState,
  getStorageOverview,
  saveLocalSettingsState,
} from '../services/settingsStorage'

export function SettingsPage() {
  const [, setRefreshKey] = useState(0)
  const storageTools = getStorageTools()
  const overview = getStorageOverview()
  const appSettingsSnapshot = getAppSettingsSnapshot()
  const localSettingsState = getLocalSettingsState()
  const healthReport = storageTools.getStorageHealthReport()
  const auditEntries = listAuditEntries()
  const safetyChecklist = getDataSafetyChecklist()
  const riskLevel = getLocalDataRiskLevel()
  const [draft, setDraft] = useState(appSettingsSnapshot.settings)
  const [activeSection, setActiveSection] = useState<AppSettingsSectionId>(
    localSettingsState.activeSection ?? 'company',
  )
  const [message, setMessage] = useState<string | null>(null)

  const refreshPage = () => {
    startTransition(() => {
      setRefreshKey((value) => value + 1)
    })
  }

  const syncDraftFromStorage = () => {
    setDraft(getAppSettingsSnapshot().settings)
  }

  const saveSectionChoice = (section: AppSettingsSectionId) => {
    setActiveSection(section)
    saveLocalSettingsState({
      ...localSettingsState,
      activeSection: section,
    })
  }

  const saveSettingsPatch = (
    patch: Parameters<typeof updateAppSettings>[0],
    successMessage: string,
  ) => {
    const result = updateAppSettings(patch)
    setDraft(result.settings)
    setMessage(result.warnings[0] ?? successMessage)
    refreshPage()
  }

  const resetToDefaults = () => {
    const result = resetAppSettings()
    setDraft(result.settings)
    setMessage('Ajustes restaurados a los valores por defecto.')
    refreshPage()
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Ajustes"
        title="Control local del sistema"
        description="Centro de control para revisar el estado local, ajustar reglas operativas y proteger el runtime local-first."
      />

      <LocalDataWarning />

      {message ? (
        <WarningBanner title="Estado de ajustes" tone="info">
          {message}
        </WarningBanner>
      ) : null}

      <SettingsHealthPanel
        backupCoverageLabel={
          overview.lastBackupAt
            ? draft.dataSafetySettings.backupReminderEnabled
              ? 'Backup local activo'
              : 'Backup disponible sin recordatorio'
            : 'Sin backup reciente'
        }
        runtimeLabel="Inactivo / solo planificacion"
        settingsVersion={appSettingsSnapshot.health.settingsVersion}
        storageModeLabel={overview.storageMode}
        customizedSections={appSettingsSnapshot.health.customizedSections}
        warnings={appSettingsSnapshot.health.warnings}
      />

      <SettingsSectionNav activeSection={activeSection} onChange={saveSectionChoice} />

      {activeSection === 'company' ? (
        <CompanySettingsPanel
          value={draft.companySettings}
          warning={getSettingsSectionWarnings('company', appSettingsSnapshot.warnings)[0]}
          onChange={(patch) =>
            setDraft((current) => ({
              ...current,
              companySettings: { ...current.companySettings, ...patch },
            }))
          }
          onSave={() =>
            saveSettingsPatch({ companySettings: draft.companySettings }, 'Ajustes de empresa guardados.')
          }
        />
      ) : null}

      {activeSection === 'hours' ? (
        <HoursPaymentSettingsPanel
          value={draft.hoursSettings}
          warning={getSettingsSectionWarnings('hours', appSettingsSnapshot.warnings)[0]}
          onChange={(patch) =>
            setDraft((current) => ({
              ...current,
              hoursSettings: { ...current.hoursSettings, ...patch },
            }))
          }
          onSave={() =>
            saveSettingsPatch({ hoursSettings: draft.hoursSettings }, 'Reglas de horas guardadas.')
          }
        />
      ) : null}

      {activeSection === 'quick-entry' ? (
        <QuickEntrySettingsPanel
          value={draft.quickEntrySettings}
          warning={getSettingsSectionWarnings('quick-entry', appSettingsSnapshot.warnings)[0]}
          onChange={(patch) =>
            setDraft((current) => ({
              ...current,
              quickEntrySettings: { ...current.quickEntrySettings, ...patch },
            }))
          }
          onSave={() =>
            saveSettingsPatch(
              { quickEntrySettings: draft.quickEntrySettings },
              'Ajustes de registro rapido guardados.',
            )
          }
        />
      ) : null}

      {activeSection === 'review' ? (
        <HourReviewSettingsPanel
          value={draft.hourReviewSettings}
          warning={getSettingsSectionWarnings('review', appSettingsSnapshot.warnings)[0]}
          onChange={(patch) =>
            setDraft((current) => ({
              ...current,
              hourReviewSettings: { ...current.hourReviewSettings, ...patch },
            }))
          }
          onSave={() =>
            saveSettingsPatch(
              { hourReviewSettings: draft.hourReviewSettings },
              'Ajustes de revision guardados.',
            )
          }
        />
      ) : null}

      {activeSection === 'services' ? (
        <ServiceSettingsPanel
          value={draft.serviceSettings}
          warning={getSettingsSectionWarnings('services', appSettingsSnapshot.warnings)[0]}
          onChange={(patch) =>
            setDraft((current) => ({
              ...current,
              serviceSettings: { ...current.serviceSettings, ...patch },
            }))
          }
          onSave={() =>
            saveSettingsPatch(
              { serviceSettings: draft.serviceSettings },
              'Ajustes de servicios guardados.',
            )
          }
        />
      ) : null}

      {activeSection === 'display' ? (
        <DisplaySettingsPanel
          value={draft.displaySettings}
          warning={getSettingsSectionWarnings('display', appSettingsSnapshot.warnings)[0]}
          onChange={(patch) =>
            setDraft((current) => ({
              ...current,
              displaySettings: { ...current.displaySettings, ...patch },
            }))
          }
          onSave={() =>
            saveSettingsPatch(
              { displaySettings: draft.displaySettings },
              'Preferencias de visualizacion guardadas.',
            )
          }
        />
      ) : null}

      {activeSection === 'data-safety' ? (
        <>
          <DataSafetySettingsPanel
            value={draft.dataSafetySettings}
            warning={getSettingsSectionWarnings('data-safety', appSettingsSnapshot.warnings)[0]}
            onChange={(patch) =>
              setDraft((current) => ({
                ...current,
                dataSafetySettings: { ...current.dataSafetySettings, ...patch },
              }))
            }
            onSave={() =>
              saveSettingsPatch(
                { dataSafetySettings: draft.dataSafetySettings },
                'Ajustes de datos y seguridad guardados.',
              )
            }
            onResetSettings={resetToDefaults}
          />

          <section className="dashboard-grid">
            <StorageHealthPanel report={healthReport} />
            <DataSafetyChecklist items={safetyChecklist} riskLevel={riskLevel} />
          </section>

          <section className="dashboard-grid">
            <BackupExportPanel
              lastBackupAt={overview.lastBackupAt}
              onDataChanged={() => {
                syncDraftFromStorage()
                refreshPage()
              }}
            />
            <ImportDataPanel
              onDataChanged={() => {
                syncDraftFromStorage()
                refreshPage()
              }}
            />
          </section>

          {draft.dataSafetySettings.showDangerZone ? (
            <ResetDemoDataPanel
              onDataChanged={() => {
                syncDraftFromStorage()
                refreshPage()
              }}
            />
          ) : null}

          <WarningBanner title="Notas de seguridad" tone="info">
            Los backups exportados son copias JSON locales del navegador. Sirven para continuidad
            operativa del prototipo, pero no sustituyen respaldo externo, seguridad empresarial ni
            sincronizacion multiusuario.
          </WarningBanner>
        </>
      ) : null}

      {activeSection === 'audit' ? (
        <>
          <AuditSettingsPanel
            entriesCount={auditEntries.length}
            showTechnicalIds={draft.displaySettings.showTechnicalIds}
          />
          <AuditLogPanel entries={auditEntries} />
        </>
      ) : null}

      {activeSection === 'system' ? (
        <>
          <SystemSettingsPanel value={draft.systemSettings} />
          <StorageOverview overview={overview} />
        </>
      ) : null}
    </div>
  )
}
