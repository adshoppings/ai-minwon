// /api/generate.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'No input provided' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is not defined in environment variables.");
    return res.status(500).json({ error: 'OPENAI_API_KEY is not set on server' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ GPT API 오류:', data);
      return res.status(500).json({ error: data?.error?.message || 'GPT API error' });
    }

    const result = data.choices?.[0]?.message?.content?.trim() || 'GPT 응답 없음';
    return res.status(200).json({ result });

  } catch (error) {
    console.error("❌ 서버 오류:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
