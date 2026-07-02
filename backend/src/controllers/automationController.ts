import { Request, Response } from 'express';

export const automationController = {
  generatePrompt: (req: Request, res: Response): void => {
    try {
      const { userQuery } = req.body;

      if (!userQuery) {
        res.status(400).json({ error: 'Missing required field: userQuery' });
        return;
      }

      const promptMarkdown = `
# Automation Integration Prompt

Based on your query: "${userQuery}"

Please copy and paste the following instructions into your no-code tool (e.g., N8N or Make):

\`\`\`markdown
1. **Trigger**: Set up an HTTP Webhook trigger listening for POST requests.
2. **Payload Mapping**: Map the incoming JSON properties to your database fields.
3. **Action**: Create a new record in your CRM/Database.
4. **Response**: Return a 200 OK status with a JSON body \`{"success": true}\`.
\`\`\`
`;

      res.json({ prompt: promptMarkdown.trim() });
    } catch (error) {
      console.error('Error generating prompt:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
