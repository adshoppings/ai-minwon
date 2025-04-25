import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ result: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ result: '입력값이 유효하지 않습니다.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ result: 'OpenAI API 키가 설정되어 있지 않습니다.' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
    });

    const gptResult = completion.data.choices[0].message?.content ?? '결과 없음';
    res.status(200).json({ result: gptResult });
  } catch (error: any) {
    console.error('OpenAI API 오류:', error?.response?.data || error.message || error);
    res.status(500).json({ result: 'GPT 처리 중 오류가 발생했습니다.' });
  }
}
