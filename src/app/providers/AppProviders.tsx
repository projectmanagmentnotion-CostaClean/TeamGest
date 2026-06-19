import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { migrateStorageIfNeeded } from '../../infrastructure/storage/storageMigrations'

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    migrateStorageIfNeeded()
  }, [])

  return <BrowserRouter>{children}</BrowserRouter>
}
