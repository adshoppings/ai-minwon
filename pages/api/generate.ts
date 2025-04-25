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
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '너는 민원 자동작성 도우미야. 답변은 정중하고 친절한 말투로 구성하며, 마지막에는 관련 서식이나 제출 안내도 간단히 포함해줘.',
        },
        { role: 'user', content: input },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim() || '';
    const suggestion = `• 민원 제목\n• 민원 내용 (정확히 서술)\n• 민원 제출 대상 기관`;

    res.status(200).json({ result, suggestion });
  } catch (error) {
    console.error('OpenAI API 에러:', error);
    res.status(500).json({ error: '민원 생성 실패' });
  }
}