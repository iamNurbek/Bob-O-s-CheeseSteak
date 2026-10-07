import { StatusPage } from '@/components/layout/StatusPage'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
  return (
    <StatusPage
      title="This page fell off the griddle"
      body="We couldn't find what you were looking for."
      primary={{ href: ROUTES.home, label: 'Go home' }}
      secondary={{ href: ROUTES.menu, label: 'See the menu' }}
    />
  )
}
