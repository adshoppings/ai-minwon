import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: `${input} 관련 민원서로 작성해줘.` }],
      model: 'gpt-3.5-turbo',
    });

    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
