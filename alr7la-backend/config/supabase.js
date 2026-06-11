// supabase.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://oexsgvcayrpoifxzrnbo.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leHNndmNheXJwb2lmeHpybmJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODIwNzY1OSwiZXhwIjoyMDYzNzgzNjU5fQ.ksctfXj9hQPGG31pnm2Hmty9xmSLZ6Emj3BN4DbceZA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = supabase;
