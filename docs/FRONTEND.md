# Frontend Documentation

The Elsan Clinic frontend is a **Next.js 15 (App Router)** application written in **TypeScript**. It prioritizes a highly responsive, aesthetically premium, and accessible User Interface suitable for a modern medical facility.

## Tech Stack Overview
- **Framework**: Next.js 15 (React 19 RC)
- **Styling**: Tailwind CSS, ShadCN UI
- **Data Fetching**: Axios, TanStack Query (React Query)
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React
- **Charts**: Recharts

---

## Folder Structure (`frontend/src/`)

- **`app/`**: Next.js App Router root.
  - `admin/layout.tsx`: The global shell for the authenticated application, containing the Sidebar and Header.
  - `admin/dashboard/page.tsx`: Contains the analytical charts and stat cards.
  - `admin/appointments/page.tsx`: The list of scheduled and past appointments.
  - `admin/visits/create/page.tsx`: The clinical entry interface for logging symptoms and generating PDFs.
- **`components/`**: Reusable UI components.
  - `ui/`: Raw ShadCN components (Button, Input, Card, Table).
  - `layout/`: Global layout structures (Sidebar, Header).
  - `providers/`: Context providers (e.g., `QueryProvider`).
- **`hooks/`**: Custom React hooks, primarily wrapping TanStack Query (`useAppointments()`, `useVisits()`).
- **`lib/`**: Core utilities and configurations.
  - `axios.ts`: The global API client with request/response interceptors for handling auth.
  - `query-client.ts`: The global TanStack Query configuration.
  - `utils.ts`: Tailwind CSS class mergers (`cn`).
- **`schemas/`**: Centralized **Zod** validation rules (`appointment.schema.ts`, `visit.schema.ts`).
- **`services/`**: The abstraction layer above `axios` containing purely typed HTTP calls (`AppointmentsService`, `VisitsService`).

---

## State Management (TanStack Query)

Instead of relying on Redux or context for server state, the app relies exclusively on React Query.
- **Data Fetching**: Hook `useAppointments()` calls `AppointmentsService.getAll()` and caches it under the query key `['appointments']`.
- **Mutations & Optimistic Updates**: Hooks like `useCreateAppointment()` handle `POST` requests and immediately call `queryClient.invalidateQueries(['appointments'])` on success, triggering a seamless re-render of the data tables without full page reloads.

## Form Validation Workflow

The clinic requires strict clinical data entry. We employ the following stack:
1. **Zod**: A schema is defined (e.g., `VisitSchema`) enforcing character limits and regex constraints (like phone numbers).
2. **React Hook Form**: We pass the Zod schema via `@hookform/resolvers/zod`.
3. **ShadCN Form Components**: Inputs are wrapped in `<FormField>` to automatically capture validation errors and display accessible red error text underneath the input fields.

## Security & Authentication

The frontend is completely stateless regarding Authentication logic. 
- It does **not** store JWTs in `localStorage`. 
- The `apiClient` in `axios.ts` is configured with `withCredentials: true`.
- The browser automatically attaches the secure `HTTPOnly` access token cookie to every outgoing request.
- If the server responds with `401 Unauthorized`, the Axios response interceptor intercepts it, automatically calls the `/api/v1/auth/refresh` endpoint, and retries the original request seamlessly. If refresh fails, it redirects the user to `/login`.
