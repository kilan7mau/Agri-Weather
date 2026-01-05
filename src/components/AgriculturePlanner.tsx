import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { generateScheduleWithGroq } from '../lib/groqApi';
import { useCity } from '../contexts/CityContext';
import DailyTaskModal from './DailyTaskModal';
import { Calendar, AlertCircle, Sparkles } from 'lucide-react';

interface AgriculturePlan {
  id: string;
  crop_name: string;
  farm_location: string;
  season_goal: string;
  notes: string | null;
}

interface DailyTask {
  id: string;
  plan_id: string;
  task_date: number;
  task_description: string;
  task_details: string | null;
}

export default function AgriculturePlanner() {
  const { selectedCity } = useCity();
  // Plans state - reserved for future feature: multiple plans management
  // Currently using only currentPlan (first plan), but keeping this for scalability
  // Prefix with _ to indicate "reserved for future use" and suppress ESLint warnings
  const [_plans, _setPlans] = useState<AgriculturePlan[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [currentPlan, setCurrentPlan] = useState<AgriculturePlan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    crop_name: '',
    farm_location: '',
    season_goal: '',
    notes: '',
  });

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPlans = async () => {
    const { data } = await supabase.from('agriculture_plans').select('*');
    if (data && data.length > 0) {
      // Store all plans (for future multi-plan feature)
      _setPlans(data as AgriculturePlan[]);
      // Set first plan as current
      setCurrentPlan(data[0] as AgriculturePlan);
      setFormData({
        crop_name: data[0].crop_name,
        farm_location: data[0].farm_location,
        season_goal: data[0].season_goal,
        notes: data[0].notes || '',
      });
      loadTasks(data[0].id);
    }
  };

  const loadTasks = async (planId: string) => {
    const { data } = await supabase.from('daily_tasks').select('*').eq('plan_id', planId);
    setTasks(data as DailyTask[]);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPlan) {
      await supabase.from('agriculture_plans').update(formData).eq('id', currentPlan.id);
      setCurrentPlan({ ...currentPlan, ...formData });
    } else {
      const { data } = await supabase.from('agriculture_plans').insert([formData]).select().single();
      if (data) {
        setCurrentPlan(data as AgriculturePlan);
        loadTasks(data.id);
      }
    }
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleTaskSave = async (description: string, details: string) => {
    if (!currentPlan || selectedDay === null) return;

    const existingTask = tasks.find(
      (t) => t.plan_id === currentPlan.id && t.task_date === selectedDay
    );

    if (existingTask) {
      await supabase
        .from('daily_tasks')
        .update({
          task_description: description,
          task_details: details,
        })
        .eq('id', existingTask.id);
    } else {
      await supabase.from('daily_tasks').insert([
        {
          plan_id: currentPlan.id,
          task_date: selectedDay,
          task_description: description,
          task_details: details,
        },
      ]);
    }

    loadTasks(currentPlan.id);
    setShowModal(false);
  };

  const handleGenerateSchedule = async () => {
    if (!currentPlan) {
      alert('⚠️ Please save a plan first!');
      return;
    }

    setIsGenerating(true);
    try {
      const schedule = await generateScheduleWithGroq({
        crop_name: currentPlan.crop_name,
        farm_location: currentPlan.farm_location,
        season_goal: currentPlan.season_goal,
        notes: currentPlan.notes || '',
        city: selectedCity
      });

      // Delete existing tasks
      await supabase.from('daily_tasks').delete().eq('plan_id', currentPlan.id);

      // Insert new AI-generated tasks
      for (const task of schedule.tasks) {
        await supabase.from('daily_tasks').insert([{
          plan_id: currentPlan.id,
          task_date: task.day,
          task_description: task.description,
          task_details: task.details
        }]);
      }

      await loadTasks(currentPlan.id);
      alert('✅ 7-Day Schedule generated successfully !');
    } catch (error) {
      console.error('Error:', error);
      alert(`❌ Failed to generate schedule: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDayName = (dayOffset: number) => {
    const today = new Date();
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getTaskForDay = (day: number) => {
    return tasks.find((t) => t.task_date === day);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Farm Planning</h2>
        <form onSubmit={handleSavePlan} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Name
              </label>
              <input
                type="text"
                value={formData.crop_name}
                onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                placeholder="e.g., Rice, Tomato, Corn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Location / Field Name
              </label>
              <input
                type="text"
                value={formData.farm_location}
                onChange={(e) => setFormData({ ...formData, farm_location: e.target.value })}
                placeholder="e.g., North Field, Plot A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Season / Goal
              </label>
              <input
                type="text"
                value={formData.season_goal}
                onChange={(e) => setFormData({ ...formData, season_goal: e.target.value })}
                placeholder="e.g., Summer 2025, Maximize yield"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Save Plan
          </button>
        </form>

        {currentPlan && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGenerateSchedule}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? 'Generating with AI...' : 'Generate 7-Day Schedule '}
            </button>
            <p className="text-sm text-gray-500 mt-2 text-center">
              AI will analyze weather forecast for {selectedCity} and create optimal farming tasks
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-500" />
          7-Day Schedule
        </h2>

        {currentPlan ? (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, dayOffset) => {
              const task = getTaskForDay(dayOffset);
              const isToday = dayOffset === 0;

              return (
                <button
                  key={dayOffset}
                  onClick={() => handleDayClick(dayOffset)}
                  className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
                    isToday
                      ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                      : task
                      ? 'bg-green-100 border-2 border-green-500 hover:shadow-lg'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-green-300'
                  }`}
                >
                  <p className={`text-sm font-semibold mb-2 ${isToday ? 'text-white' : 'text-gray-600'}`}>
                    {isToday ? 'TODAY' : getDayName(dayOffset).split(',')[0]}
                  </p>
                  <p className={`text-xs mb-3 ${isToday ? 'text-blue-100' : 'text-gray-500'}`}>
                    {getDayName(dayOffset)}
                  </p>
                  {task ? (
                    <p className={`text-sm font-medium break-words text-left ${
                      isToday ? 'text-white' : 'text-gray-900'
                    }`}>
                      {task.task_description}
                    </p>
                  ) : (
                    <p className={`text-xs italic ${isToday ? 'text-blue-100' : 'text-gray-400'}`}>
                      No task
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Create a plan first to add tasks</p>
          </div>
        )}
      </div>

      {showModal && selectedDay !== null && currentPlan && (
        <DailyTaskModal
          dayName={getDayName(selectedDay)}
          existingTask={getTaskForDay(selectedDay)}
          onSave={handleTaskSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
