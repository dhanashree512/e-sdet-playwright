import dotenv from 'dotenv';
dotenv.config();
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PAGE_DESCRIPTION = `
Page: Sauce Demo Login Page
URL: https://www.saucedemo.com
Elements:
- Username input field (data-test="username")
- Password input field (data-test="password")  
- Login button (data-test="login-button")
- Error message container (data-test="error")

Valid credentials:
- standard_user / secret_sauce
- locked_out_user / secret_sauce (should be blocked)

Framework: Playwright + TypeScript
Fixture import: import { test, expect } from '../fixtures/baseFixture';
Page object: LoginPage with methods: goto(), login(username, password), getErrorMessage()
`;

async function generateTests() {
  console.log('🤖 Generating test cases with AI...\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are an expert SDET. Generate a complete Playwright TypeScript test file for the following page. 
        
Return ONLY the raw TypeScript code with no markdown, no backticks, no explanation.

${PAGE_DESCRIPTION}

Requirements:
- Use the fixture import provided
- Use the LoginPage page object methods provided
- Cover happy path, negative scenarios, and edge cases
- Use descriptive test names
- Group tests with test.describe blocks
- Include test.beforeEach for navigation`,
      },
    ],
  });

  const generatedCode = response.content
    .filter(block => block.type === 'text')
    .map(block => (block as { type: 'text'; text: string }).text)
    .join('\n');

  const outputPath = path.join('tests', 'ui', 'ai-generated-login.spec.ts');
  fs.writeFileSync(outputPath, generatedCode);

  console.log('✅ Test file generated successfully!');
  console.log(`📄 Output: ${outputPath}\n`);
  console.log('Generated code preview:\n');
  console.log(generatedCode.substring(0, 500) + '...\n');
}

generateTests().catch(console.error);