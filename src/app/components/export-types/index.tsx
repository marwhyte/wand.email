import { ExportTypeComponent } from './export-type'
import { htmlExportType } from './html-export'
import { mailchimpExportType } from './mailchimp-export'

// Register all export types here
export const exportTypes: ExportTypeComponent[] = [htmlExportType, mailchimpExportType]

// This will be used to add more OAuth export types in the future
export const oauthExportTypes: ExportTypeComponent[] = [mailchimpExportType]
