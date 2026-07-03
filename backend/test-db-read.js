const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data, error } = await supabase.from('webhooks').select('*');
  console.log('Select Data:', data);
  console.log('Select Error:', error);
}

test();
