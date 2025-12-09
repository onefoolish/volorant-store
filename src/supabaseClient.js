// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uxlvpevwmwprfmmirysy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bHZwZXZ3bXdwcmZtbWlyeXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNjY4MzAsImV4cCI6MjA4MDg0MjgzMH0.2ZwB0GqvFGQPa-qUIuN5xfbTKjVa8HyNYRGV-9pkK3c'

export const supabase = createClient(supabaseUrl, supabaseKey)