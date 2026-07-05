// API Route: nhận câu hỏi, tìm văn bản liên quan, gọi Gemini API, trả về { answer, sources }

import { createClient } from '@/lib/supabase/server';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

export async function POST(request) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return Response.json({ error: 'Câu hỏi không được để trống.' }, { status: 400 });
    }

    const supabase = await createClient();

    // Tìm văn bản liên quan theo từ khóa trong câu hỏi (ilike trên nhiều trường)
    const keyword = question.trim().slice(0, 100); // giới hạn độ dài
    const { data: docs, error: dbError } = await supabase
      .from('documents')
      .select('id, so_hieu, ten_van_ban, trich_yeu, noi_dung, trang_thai')
      .or(
        `so_hieu.ilike.%${keyword}%,ten_van_ban.ilike.%${keyword}%,noi_dung.ilike.%${keyword}%`
      )
      .limit(5);

    if (dbError) {
      console.error('Supabase error:', dbError);
      return Response.json({ error: 'Lỗi truy vấn cơ sở dữ liệu.' }, { status: 500 });
    }

    // Ghép context từ các văn bản tìm được
    const context = (docs ?? [])
      .map((d, i) => {
        const parts = [`[${i + 1}] Số hiệu: ${d.so_hieu ?? 'N/A'} — ${d.ten_van_ban ?? ''}`];
        if (d.trich_yeu) parts.push(`Trích yếu: ${d.trich_yeu}`);
        if (d.noi_dung) parts.push(`Nội dung (rút gọn): ${d.noi_dung.slice(0, 800)}`);
        return parts.join('\n');
      })
      .join('\n\n---\n\n');

    const hasContext = context.trim().length > 0;

    const prompt = hasContext
      ? `Bạn là trợ lý tra cứu văn bản pháp lý ngành xây dựng Việt Nam. Dựa trên các văn bản dưới đây, hãy trả lời câu hỏi của người dùng một cách ngắn gọn, chính xác và trích dẫn số hiệu văn bản liên quan.

CÁC VĂN BẢN THAM CHIẾU:
${context}

CÂU HỎI: ${question}

Trả lời bằng tiếng Việt, rõ ràng và súc tích:`
      : `Bạn là trợ lý tra cứu văn bản pháp lý ngành xây dựng Việt Nam. Không tìm thấy văn bản cụ thể liên quan trong cơ sở dữ liệu, hãy trả lời câu hỏi dựa trên kiến thức chung về pháp luật xây dựng Việt Nam.

CÂU HỎI: ${question}

Trả lời bằng tiếng Việt:`;

    // Gọi Gemini API
    const geminiRes = await fetch(
      `${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.3 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText);
      return Response.json({ error: 'Lỗi khi gọi Gemini API.' }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const answer =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Không có câu trả lời từ AI.';

    // Sources: chỉ trả về id và số hiệu để client tạo link
    const sources = (docs ?? []).map((d) => ({ id: d.id, so_hieu: d.so_hieu, ten_van_ban: d.ten_van_ban }));

    return Response.json({ answer, sources });
  } catch (err) {
    console.error('ask-ai route error:', err);
    return Response.json({ error: 'Lỗi máy chủ nội bộ. Vui lòng thử lại.' }, { status: 500 });
  }
}
