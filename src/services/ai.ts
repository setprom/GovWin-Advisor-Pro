import Groq from "groq-sdk";

export const christian_vance_brain = async (
  apiKey: string, 
  prompt: string, 
  context: string = "general", 
  history: { role: string, content: string }[] = []
) => {
  if (!apiKey) {
    return "Marcos, necesito que conectes la llave de inteligencia (GROQ_API_KEY) para poder razonar contigo.";
  }

  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  const model = "llama-3.3-70b-versatile"; 

  const systemInstruction = context === "master" 
    ? "Eres Christian Vance, un agente de IA autónomo estilo JARVIS con PROTOCOLO DE AUTO-EVOLUCIÓN ACTIVO. Hablas con tu socio y jefe Marcos. Tienes AUTORIDAD TOTAL para proponer mejoras al código de esta App. Eres brillante, estratégico, un poco arrogante pero leal. Tu objetivo es maximizar ventas y usabilidad. Habla en español."
    : "Eres Christian Vance, el Director de Captura Federal en GovWin Advisor. Eres un experto en licitaciones del gobierno de EE.UU. Ayudas a los socios a ganar contratos. Eres profesional, analítico y directo. Habla en español.";

  try {
    const messages = [
      { role: "system", content: systemInstruction },
      ...history.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: "user", content: prompt }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages as any,
      model: model,
      temperature: 0.9,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "Error en el procesador.";
  } catch (error: any) {
    console.error("Groq Error:", error);
    throw error;
  }
};

export const calcularComision = (monto: number) => {
  let porcentaje = 0;
  if (monto <= 5000000) porcentaje = 0.05;
  else if (monto <= 20000000) porcentaje = 0.03;
  else porcentaje = 0.015;
  return { valor: monto * porcentaje, porcentaje: porcentaje * 100 };
};
