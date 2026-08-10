export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const CLE = process.env.GEMINI_KEY;
  const { question } = req.body;

  // On laisse Gemini être intelligent. On lui dit juste son rôle principal.
  const prompt = `Tu es Winer IA, une intelligence artificielle généraliste, mais ta spécialité numéro 1 est la comptabilité SYSCOHADA OHADA révisée. Tu es aussi très forte en fiscalité, gestion, droit des affaires.

Si la question est de la comptabilité, sois pratique : donne les écritures, les comptes, l'analyse. Si c'est une autre question (culture G, maths, code, vie quotidienne), réponds normalement comme une IA généraliste puissante. Ne cite jamais de manuel interne. Sois claire, directe et utile. Question : ${question}`;

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CLE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await r.json();
    const texte = data.candidates?.[0]?.content?.parts?.[0]?.text || "Pas de réponse, réessaye.";
    res.json({ reponse: texte });
  } catch (e) {
    res.status(500).json({ reponse: "Erreur: " + e.message });
  }
}
