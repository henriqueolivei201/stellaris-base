import { supabase } from '@/lib/supabase'

supabase.from('tasks').select('*').then(({ data, error }) => {
  console.log('data:', data)
  console.log('error:', error)
})