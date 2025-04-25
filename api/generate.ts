export default async function handler(req, res) {
  const { content } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '너는 민원서 작성 도우미야.' },
        { role: 'user', content: `다음 내용을 바탕으로 민원서를 공손하게 작성해줘:\n${content}` }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices?.[0]?.message?.content });
}
// 여기에 GPT 호출 API 코드가 들어갈 예정입니다.
