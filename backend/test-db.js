const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data, error } = await supabase.from('webhooks').insert([{ token: 'test-token', url: 'test-url' }]);
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
