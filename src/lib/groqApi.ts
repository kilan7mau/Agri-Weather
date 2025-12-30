const API_BASE_URL = 'http://localhost:8000';

export interface ScheduleRequest {
  crop_name: string;
  farm_location: string;
  season_goal: string;
  notes: string;
  city: string;
}

export interface Task {
  day: number;
  description: string;
  details: string;
}

export interface ScheduleResponse {
  tasks: Task[];
}

export async function generateScheduleWithGroq(planData: ScheduleRequest): Promise<ScheduleResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/groq/generate-schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate schedule');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating schedule:', error);
    throw error;
  }
}

export async function testGroqConnection(): Promise<{ status: string; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/groq/test`);
    return await response.json();
  } catch (error) {
    console.error('Error testing Groq connection:', error);
    return { status: 'error', message: String(error) };
  }
}

