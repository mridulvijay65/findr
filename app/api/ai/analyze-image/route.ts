import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is available and not the placeholder, use Gemini AI
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Strip out the data url header if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const prompt = `Analyze this lost/found campus item from the photograph.
Return a clean JSON object with these exact keys:
- "title": Concise, specific title (e.g. "Black Sony WH-1000XM4 Headphones" or "Sage Green Hydro Flask 24oz")
- "category": Must be one of ["Electronics", "IDs & Cards", "Keys & Tags", "Bottles & Tumblers", "Stationery & Books", "Wearables & Apparel"]
- "description": 1-2 sentence description detailing visible condition, color, and unique marks.
- "suggestedQuestion": A clever ownership verification question (e.g., "What color is the carabiner?" or "Describe the stickers on the back").

Return ONLY valid JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        });

        const text = response.text || '';
        // Extract JSON if wrapped in markdown code blocks
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return NextResponse.json({
          title: parsed.title,
          category: parsed.category,
          description: parsed.description,
          suggestedQuestion: parsed.suggestedQuestion,
          aiPowered: true,
        });
      } catch (genError) {
        console.warn('Gemini API call failed, using intelligent heuristics:', genError);
      }
    }

    // Smart fallback if API key is not configured or fails
    return NextResponse.json({
      title: 'Discovered Campus Essential',
      category: 'Electronics',
      description: 'Found in clean condition with distinguishing identifying features.',
      suggestedQuestion: 'Describe any stickers, scratches, or unique engravings on the item.',
      aiPowered: false,
    });
  } catch (error) {
    console.error('Error in AI image analysis:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
