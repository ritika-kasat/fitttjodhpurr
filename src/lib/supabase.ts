import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

/**
 * Helper to retrieve the role of the currently authenticated user.
 * Returns role string (e.g., 'member', 'admin', 'provider') or null if not logged in or role missing.
 */
export const getUserRole = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user?.id) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
  if (error) {
    console.error('Failed to fetch user role:', error)
    return null
  }
  return data?.role ?? null
}
