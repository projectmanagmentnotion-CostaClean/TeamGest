# Security and Privacy Notes

## Current reality

TeamGest is still a local-first prototype runtime.

- localStorage is not secure enterprise storage
- payroll-related information should move to a protected backend before real multi-user use
- JSON backups are portable files and must be handled carefully

## Main risks today

- browser/device access exposes local operational data
- clearing browser data can remove persistent state
- shared machines increase exposure risk
- no user authentication or role isolation exists

## Future requirements

- authenticated sessions
- row-level access control
- audit integrity protections
- careful handling of exported backups
- data minimization for payroll-sensitive information

## Recommended posture before real rollout

- do not treat current local mode as secure storage
- protect backup files outside the app
- complete auth and backend access policy before multi-user deployment
