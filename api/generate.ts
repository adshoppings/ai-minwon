// /api/generate.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'No input provided' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: input }],
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error('GPT 응답 오류:', data);
      return res.status(500).json({ error: data?.error?.message || 'GPT API 오류 발생' });
    }

    const result = data.choices?.[0]?.message?.content?.trim() || 'GPT 응답 없음';
    return res.status(200).json({ result });

  } catch (error) {
    console.error('서버 에러:', error);
    return res.status(500).json({ error: '서버 내부 오류 발생' });
  }
}
