import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const cleanJsonResponse = (text) => {
  // Remove markdown code block formatting if present
  return text.replace(/```json\n?|\n?```/g, '').trim();
};

export const parseTranscriptWithAI = async (transcript) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'Extract tasks from the meeting transcript into a JSON array of objects. Each object must have the keys `taskName`, `assignedTo`, `dueDate`, and `priority`. Map high urgency/importance to priority P1, medium to P2, and low to P3. If a value for `assignedTo`, `dueDate`, or `priority` is not explicitly mentioned or clearly inferable for a task, set the value to `null`. Return only the JSON array, with no surrounding text or markdown.'
          },
          {
            role: 'user',
            content: transcript
          }
        ],
        max_tokens: 300,
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const cleanedContent = cleanJsonResponse(content);
    const parsedTasks = JSON.parse(cleanedContent);
    // Ensure all required fields are present, default to null if missing after parsing
    const validatedTasks = parsedTasks.map(task => ({
        taskName: task.taskName || null,
        assignedTo: task.assignedTo || null,
        dueDate: task.dueDate || null,
        priority: task.priority || null,
        // Add any other default fields needed for your task structure if not provided by AI
        // id and status are added in App.jsx handleParsedTasks
    }));
    return validatedTasks;
  } catch (error) {
    console.error('Error parsing transcript:', error);
    // Attempt to provide a more user-friendly error based on the API response
    let userMessage = 'Failed to parse transcript. Please try again.';
    if (error.response && error.response.data && error.response.data.error) {
      userMessage = `API Error: ${error.response.data.error.message}`;
      console.error('OpenAI API Error details:', error.response.data.error);
    } else if (error.message) {
       userMessage = `Parsing Error: ${error.message}`;
    }
    throw new Error(userMessage);
  }
}; 