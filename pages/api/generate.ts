import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: '입력값이 없습니다.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `아래 민원 요청에 대해 감성적이고 친절한 어투로 설명해줘. 그리고 사용자가 어떤 서식으로 작성해야 할지도 함께 안내해줘.

"${input}"`
      }],
    });

    const result = completion.choices[0]?.message?.content?.trim() || '';
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI API 에러:', error);
    res.status(500).json({ error: '민원 생성 실패' });
  }
}
