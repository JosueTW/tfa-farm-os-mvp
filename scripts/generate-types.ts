/**
 * Generate TypeScript types from Supabase database
 * Run with: npm run types:generate
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error('Error: SUPABASE_PROJECT_ID environment variable is not set');
  console.log('Please add SUPABASE_PROJECT_ID to your .env.local file');
  process.exit(1);
}

const outputPath = path.join(process.cwd(), 'lib', 'supabase', 'types.ts');

console.log('🔄 Generating Supabase types...');
console.log(`   Project ID: ${projectId}`);
console.log(`   Output: ${outputPath}\n`);

try {
  // Generate types using Supabase CLI
  const command = `npx supabase gen types typescript --project-id ${projectId}`;
  const types = execSync(command, { encoding: 'utf-8' });

  // Ensure the directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Add header comment and convenience types
  const header = `/**
 * Database types for Supabase
 * Auto-generated from database schema
 * Run \`npm run types:generate\` to update
 * 
 * Generated: ${new Date().toISOString()}
 */

`;

  const footer = `

// Convenience types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
`;

  // Write the file
  fs.writeFileSync(outputPath, header + types + footer);

  console.log('✅ Types generated successfully!');
  console.log(`   File: ${outputPath}`);
} catch (error) {
  console.error('❌ Failed to generate types:', error);
  console.log('\nMake sure you have:');
  console.log('1. Installed Supabase CLI: npm install -g supabase');
  console.log('2. Logged in: supabase login');
  console.log('3. Set SUPABASE_PROJECT_ID in .env.local');
  process.exit(1);
}
