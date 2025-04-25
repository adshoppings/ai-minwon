import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  // 실제 GPT API 호출 대신, 테스트용 mock 응답
  const responseText = `입력한 내용: "${input}" 에 대한 민원이 성공적으로 작성되었습니다.`;

  return res.status(200).json({ result: responseText });
}
