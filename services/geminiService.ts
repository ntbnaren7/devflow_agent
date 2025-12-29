import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MODEL_LIGHT, MODEL_REASONING, MODEL_BALANCED, SYSTEM_PROMPT_BASE, ENUMERATION_PROMPT, EVALUATION_PROMPT, BLUEPRINT_PROMPT } from "../constants";
import { Pipeline, EvaluationResult, ProjectIntake, Blueprint } from "../types";

const apiKey = process.env.API_KEY || '';

// Helper to check API Key
export const hasApiKey = () => !!apiKey;

const ai = new GoogleGenAI({ apiKey });

export const generatePipelines = async (intake: ProjectIntake): Promise<Pipeline[]> => {
  const prompt = `${ENUMERATION_PROMPT}
  
  Project Details:
  Problem: ${intake.problem}
  User: ${intake.user}
  Output: ${intake.output}
  Constraints: ${intake.constraints}
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        architecture: { type: Type.STRING },
        summary: { type: Type.STRING },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } },
        complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
        risks: { type: Type.ARRAY, items: { type: Type.STRING } },
        scalability: { type: Type.STRING },
        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['id', 'name', 'architecture', 'summary', 'tools', 'complexity', 'risks', 'scalability', 'pros', 'cons'],
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_LIGHT, // Using Flash for stability with structured output
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_BASE,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as Pipeline[];
  } catch (error) {
    console.error("Pipeline Generation Error:", error);
    throw error;
  }
};

export const evaluatePipelines = async (pipelines: Pipeline[], intake: ProjectIntake): Promise<EvaluationResult> => {
  const prompt = `${EVALUATION_PROMPT}

  Project Context:
  ${JSON.stringify(intake)}

  Pipelines to Evaluate:
  ${JSON.stringify(pipelines)}
  `;

  const robustSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        selectedPipelineId: { type: Type.STRING },
        reasoning: { type: Type.STRING },
        reasoningSummary: { type: Type.STRING },
        evaluations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    pipelineId: { type: Type.STRING },
                    speed: { type: Type.NUMBER, description: "1-10 score" },
                    reliability: { type: Type.NUMBER, description: "1-10 score" },
                    cognitiveLoad: { type: Type.NUMBER, description: "1-10 score (10 being highest load)" },
                    extensibility: { type: Type.NUMBER, description: "1-10 score" }
                },
                required: ["pipelineId", "speed", "reliability", "cognitiveLoad", "extensibility"]
            }
        }
    },
    required: ['selectedPipelineId', 'reasoning', 'reasoningSummary', 'evaluations']
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_LIGHT, // Using Flash for stability with structured output
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_BASE,
        responseMimeType: "application/json",
        responseSchema: robustSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    const result = JSON.parse(text);
    
    // Transform back to the shape our UI expects
    const scores: Record<string, any> = {};
    if (result.evaluations && Array.isArray(result.evaluations)) {
        result.evaluations.forEach((e: any) => {
            scores[e.pipelineId] = {
                speed: e.speed,
                reliability: e.reliability,
                cognitiveLoad: e.cognitiveLoad,
                extensibility: e.extensibility
            };
        });
    }

    return {
        selectedPipelineId: result.selectedPipelineId,
        reasoning: result.reasoning,
        reasoningSummary: result.reasoningSummary,
        scores
    };

  } catch (error) {
    console.error("Evaluation Error:", error);
    throw error;
  }
};

export const generateBlueprint = async (pipeline: Pipeline, intake: ProjectIntake): Promise<Blueprint> => {
  const prompt = `${BLUEPRINT_PROMPT}

  Selected Pipeline:
  ${JSON.stringify(pipeline)}

  Project Context:
  ${JSON.stringify(intake)}
  `;

  const schema: Schema = {
      type: Type.OBJECT,
      properties: {
          markdown: { type: Type.STRING, description: "The full markdown execution plan" },
          summary: { type: Type.STRING, description: "Executive summary of the plan" },
          flowchart: { type: Type.STRING, description: "Mermaid.js flowchart syntax string (graph TD)" }
      },
      required: ['markdown', 'summary', 'flowchart']
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_LIGHT, // Switch to Flash for consistent JSON schema adherence
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_BASE,
        responseMimeType: "application/json",
        responseSchema: schema
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as Blueprint;
  } catch (error) {
    console.error("Blueprint Error:", error);
    throw error;
  }
};

export const sendChatMessage = async (history: {role: string, content: string}[], message: string, context: string): Promise<string> => {
    const chat = ai.chats.create({
        model: MODEL_LIGHT,
        config: {
            systemInstruction: `${SYSTEM_PROMPT_BASE}\n\nCurrent Project Context:\n${context}`
        },
        history: history.map(h => ({
            role: h.role,
            parts: [{ text: h.content }]
        }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
}