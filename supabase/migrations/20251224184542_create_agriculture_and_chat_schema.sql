/*
  # Create Agriculture Plans and Chat Schema

  1. New Tables
    - `agriculture_plans`
      - `id` (uuid, primary key) - Unique identifier
      - `crop_name` (text) - Name of the crop being planted
      - `farm_location` (text) - Location or field name
      - `season_goal` (text) - Season or farming goal
      - `notes` (text) - Additional notes about the plan
      - `created_at` (timestamp) - When the plan was created
      - `updated_at` (timestamp) - Last update time

    - `daily_tasks`
      - `id` (uuid, primary key) - Unique identifier
      - `plan_id` (uuid, foreign key) - Reference to agriculture plan
      - `task_date` (date) - Date of the task (0-6 representing next 7 days from today)
      - `task_description` (text) - Description of the task (watering, fertilizing, etc.)
      - `task_details` (text) - Detailed notes about the task
      - `created_at` (timestamp) - When the task was created
      - `updated_at` (timestamp) - Last update time

    - `chat_messages`
      - `id` (uuid, primary key) - Unique identifier
      - `message_text` (text) - The message content
      - `sender` (text) - 'user' or 'bot'
      - `created_at` (timestamp) - When the message was sent

  2. Security
    - Enable RLS on all tables
    - Add policies to allow basic read/write operations
    - Chat messages are kept simple without auth for now
*/

CREATE TABLE IF NOT EXISTS agriculture_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL,
  farm_location text NOT NULL,
  season_goal text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES agriculture_plans(id) ON DELETE CASCADE,
  task_date integer NOT NULL,
  task_description text NOT NULL,
  task_details text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_text text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('user', 'bot')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agriculture_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on agriculture_plans"
  ON agriculture_plans
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on daily_tasks"
  ON daily_tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on chat_messages"
  ON chat_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);
