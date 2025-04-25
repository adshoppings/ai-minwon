import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  // 실제 GPT API 연동 로직이 들어갈 자리
  const mockResult = `입력한 내용: "${input}"에 대한 민원이 자동으로 작성되었습니다.`;

  return res.status(200).json({ result: mockResult });
}
