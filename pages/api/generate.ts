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
  if (!input) {
    return res.status(400).json({ error: '입력값이 없습니다.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `아래 민원 내용에 대해 인사말로 시작해서, 상황 설명, 서식 안내, 마무리 멘트까지 포함해서 3단 구성으로 친절하게 서술형으로 작성해줘.

"${input}"`,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim() || '';
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI API 에러:', error);
    res.status(500).json({ error: '민원 생성 실패' });
  }
}
