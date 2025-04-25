import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 메서드입니다.' });
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
        content: `아래 주제에 대해 친절한 민원 답변 형식으로 HTML 서식 포함해서 작성해줘.
- 문단 제목은 <strong> 사용
- 줄바꿈은 <br> 사용
- 리스트 항목은 <ul><li> 사용
- 전체는 HTML 형식
주제: ${input}`
      }]
    });

    const result = completion.choices[0]?.message?.content?.trim() || '';
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI 응답 실패' });
  }
}
