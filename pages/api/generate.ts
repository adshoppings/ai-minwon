import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
    });

    const response = completion.choices[0]?.message?.content?.trim() || '결과 없음';
    return res.status(200).json({ result: response });
  } catch (error: any) {
    console.error('OpenAI Error:', error.message);
    return res.status(500).json({ error: 'OpenAI 호출 중 에러 발생' });
  }
}
