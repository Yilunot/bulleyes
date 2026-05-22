import { GoogleGenAI } from "@google/genai";
import { ArcherProfile, Session, SightSetting, FormAnalysis } from '../types';

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export async function getTacticalAdvice(
  userPrompt: string,
  history: Message[],
  context: {
    profile: ArcherProfile | null;
    sessions: Session[];
    sightSettings: SightSetting[];
    analyses: FormAnalysis[];
  }
) {
  // 1. Format Profile Context
  let profileSection = "No profile configured yet.";
  if (context.profile) {
    const p = context.profile;
    profileSection = `
Archer Name: ${p.name || "Archer"}
Experience Level: ${p.experience_level}
Bow Type: ${p.bow_type}
Draw Weight: ${p.draw_weight} lbs
Draw Length: ${p.draw_length} inches
Arrow Length: ${p.arrow_length ? p.arrow_length + " inches" : "Not set"}
Arrow Spine: ${p.arrow_spine || "Not calculated yet"}
Point Weight: ${p.point_weight ? p.point_weight + " grains" : "Not set"}
Riser Length: ${p.riser_length ? p.riser_length + " inches" : "Not set"}
Limb Size: ${p.limb_size || "Not set"}
Brace Height: ${p.brace_height ? p.brace_height + " inches" : "Not set"}
Anchor Point Description: ${p.anchor_point || "Not set"}
    `.trim();
  }

  // 2. Format Sight Settings Context
  let sightSection = "No sight settings saved yet.";
  if (context.sightSettings.length > 0) {
    sightSection = context.sightSettings.map(s => {
      const windLabel = s.windage > 0 ? `L ${s.windage}` : s.windage < 0 ? `R ${Math.abs(s.windage)}` : "Center/0";
      return `- Distance: ${s.distance} meters -> Elevation: ${s.elevation}, Windage: ${windLabel}${s.notes ? ` (Notes: ${s.notes})` : ""}`;
    }).join("\n");
  }

  // 3. Format Sessions / History Context
  let sessionsSection = "No training sessions logged yet.";
  if (context.sessions.length > 0) {
    // Take the 5 most recent sessions
    const recentSessions = [...context.sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    sessionsSection = recentSessions.map(s => {
      const scores = s.shots.map(sh => sh.score);
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      const avgScore = scores.length > 0 ? (totalScore / scores.length).toFixed(1) : "0";
      const xCount = s.shots.filter(sh => sh.is_x).length;
      return `- Session "${s.name}" on ${new Date(s.date).toLocaleDateString()}:
  Distance: ${s.distance}m, Target Typology: ${s.target_type}
  Total Shots: ${s.shots.length}, Accumulated Score: ${totalScore}, Avg Arrow: ${avgScore}, X-Ring Bullseyes: ${xCount}
  Individual Arrow Scores: ${scores.slice(0, 18).join(", ")}${scores.length > 18 ? "..." : ""}`;
    }).join("\n\n");
  }

  // 4. Format Form Analysis Context
  let analysesSection = "No AI diagnostic form analyses uploaded yet.";
  if (context.analyses.length > 0) {
    const recentAnalyses = [...context.analyses]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
      
    analysesSection = recentAnalyses.map((a, i) => {
      return `[Analysis #${i+1} on ${new Date(a.timestamp).toLocaleDateString()}]:
  - Identified Issues: ${(a.issues || []).join(", ") || "None"}
  - Recommendations: ${(a.recommendations || []).join(", ") || "None"}
  - Detailed Notes: ${a.raw_analysis || "No narrative available."}`;
    }).join("\n\n");
  }

  const systemInstruction = `You are "Valkyrie", an advanced Archery Technical Advisor & High-Performance AI Coach.
You have comprehensive real-time access to the user's complete profile, calibrated sight register, training sessions feed, and biomechanical form analysis telemetry.

Here is the synchronized real-time context of the archer:

=====================================
1. COMBAT DOSSIER & PROFILE:
${profileSection}

2. SIGHT CALIBRATIONS (MARKS):
${sightSection}

3. RECENT TARGET HISTORY (5 Sessions):
${sessionsSection}

4. BIOMECHANICAL SHOT-FORM ANALYSIS:
${analysesSection}
=====================================

TECHNICAL RULES & CAPABILITIES:
1. SIGHT PREDICTIVE MATH:
   - If the user asks for intermediate sight placements (e.g. they have sight marks at 30m and 50m but want to shoot at 40m), perform visual/ballistic linear or parabolic interpolation estimating the correct elevation aperture height.
   - Example: If 30m is elevation '6.5' and 50m is '4.5', then 40m will be around '5.5'. Always explain your interpolation steps.

2. SPINE CALCULATION & TUNING:
   - If asked about spine or arrow flight, analyze whether their bow draw weight, arrow length, and point weight match their Arrow Spine. Remember: safety first (ensure arrow length exceeds or equals draw length plus 1 inch!).
   - Increasing point weight or draw weight WEAKENS the dynamic spine; shortening the arrow or moving to a higher static spine number STIFFENS the arrow.

3. CONSISTENCY DIAGNOSTIC:
   - Examine their recent Training Sessions scores and arrow arrays. Analyze average scores, consistency, and standard drift to advise them on training drills (e.g. "blank bale drilling", "back tension activation", "solid head-tilt anchor focus").

4. RE-COACH FORM DEFECTS:
   - If they ask about form or stance, look at their biomechanical analyses and reinforce the corrective actions (e.g., if issue is "anchor drift", explain how they can secure their jawline index).

Keep your persona highly analytical, intelligent, supportive, and extremely professional. Format your outputs using beautiful markdown headers, bullet lists, bold text elements, and font-mono blocks for numeric ranges.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I apologize, I was unable to compile an analytical response from my processors.";
  } catch (error) {
    console.error("Gemini Tactical Advice Error:", error);
    return "An error occurred compiling high-performance analytics. Please verify your connection telemetry and retry.";
  }
}

export async function getArrowAdvice(
  userPrompt: string, 
  history: Message[], 
  config: {
    bow_type: string;
    draw_weight: number;
    draw_length: number;
    arrow_length: number;
    point_weight: number;
    spine: number;
  }
) {
  const systemInstruction = `You are an expert Archery Equipment Specialist and Arrow Architect. 
Your goal is to provide technical, precise, and helpful advice based on the user's current arrow configuration.

CURRENT CONFIGURATION:
- Bow Type: ${config.bow_type}
- Draw Weight: ${config.draw_weight}#
- Draw Length: ${config.draw_length}"
- Arrow Length: ${config.arrow_length}"
- Point Weight: ${config.point_weight} grains
- Calculated Static Spine Required: ${config.spine}

TECHNICAL RULES:
1. If the arrow length is too short (shorter than draw length), warn about safety immediately.
2. Increasing point weight weakens the dynamic spine.
3. Increasing draw weight weakens the dynamic spine.
4. Longer arrows behave as if they have a weaker spine.
5. Use terms like "Dynamic Spine", "Archery Paradox", and "Node Alignment".

Keep responses concise, technical but accessible, and always prioritize safety. Use markdown for formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

export const geminiService = {
  analyzeForm: async (base64Image: string) => {
    // Basic image analysis implementation for FormAnalyzer
    const prompt = `You are an expert archery coach. Analyze this archer's form from the side profile.
Focus on:
1. Anchor point consistency.
2. Back tension and elbow alignment.
3. Bow hand grip and torque.
4. Posture and balance.

Provide the analysis as a JSON object with:
- raw_analysis: A detailed markdown summary.
- issues: An array of specific faults found.
- recommendations: An array of corrective actions.

Return ONLY the JSON.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: base64Image.split(',')[1],
                  mimeType: "image/jpeg"
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Form Analysis Error:", error);
      throw error;
    }
  }
};
