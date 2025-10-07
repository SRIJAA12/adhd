// src/services/mlApi.js
const ML_API_BASE = 'http://localhost:8001';

class MLApi {
  async checkHealth() {
    try {
      const response = await fetch(`${ML_API_BASE}/health`);
      if (!response.ok) throw new Error('Service unavailable');
      return await response.json();
    } catch (error) {
      console.warn('ML service offline:', error);
      return { status: 'offline', models_loaded: false };
    }
  }

  async predictTask(task, userState) {
    try {
      const response = await fetch(`${ML_API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, userState })
      });

      if (!response.ok) throw new Error('Prediction failed');
      return await response.json();
    } catch (error) {
      console.error('Using fallback prediction:', error);
      return this.fallbackPrediction(task, userState);
    }
  }

  async predictBatch(tasks, userState) {
    try {
      const response = await fetch(`${ML_API_BASE}/predict-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, userState })
      });

      if (!response.ok) throw new Error('Batch prediction failed');
      return await response.json();
    } catch (error) {
      console.error('Using fallback batch prediction:', error);
      return this.fallbackBatchPrediction(tasks, userState);
    }
  }

  fallbackPrediction(task, userState) {
    const medBoost = userState.medicationTaken ? 0.15 : 0;
    const durFactor = task.estimatedDurationMin <= 30 ? 1.0 : 
                     task.estimatedDurationMin <= 60 ? 0.8 : 0.6;
    
    const priority = Math.min(1.0, (
      task.importance * 0.4 +
      task.urgency * 0.3 +
      userState.energy * 0.2 +
      medBoost
    ) * durFactor);
    
    const completion = Math.min(1.0, (
      userState.energy * 0.3 +
      userState.mood * 0.25 +
      userState.focus * 0.25 +
      (1 - userState.stressLevel) * 0.1 +
      medBoost
    ) * durFactor);
    
    return {
      priorityScore: priority,
      completionLikelihood: completion,
      predictionSource: 'algorithmic_fallback',
      reasoning: {
        adhd_recommendations: [
          medBoost > 0 ? '✅ Medication active' : '💊 Consider medication timing',
          priority > 0.7 ? '🔥 High priority task' : '📋 Medium priority'
        ]
      }
    };
  }

  fallbackBatchPrediction(tasks, userState) {
    const predictions = tasks.map(task => {
      const prediction = this.fallbackPrediction(task, userState);
      
      // Generate subtasks
      const subtasks = this.generateSubtasks(task);
      
      return {
        task,
        ...prediction,
        subtasks,
        recommendations: prediction.reasoning.adhd_recommendations
      };
    });

    // Sort by priority
    predictions.sort((a, b) => b.priorityScore - a.priorityScore);

    return {
      predictions,
      high_priority_count: predictions.filter(p => p.priorityScore > 0.7).length,
      predictionSource: 'algorithmic_fallback'
    };
  }

  generateSubtasks(task) {
    const duration = task.estimatedDurationMin || 30;
    const subtasks = [];

    if (duration <= 15) {
      // Simple task - just do it
      subtasks.push({
        title: task.title,
        duration: duration,
        type: 'simple'
      });
    } else {
      // Break down into steps
      subtasks.push({
        title: 'Gather materials and prepare workspace',
        duration: 5,
        type: 'setup'
      });

      const workSessions = Math.ceil((duration - 5) / 25);
      for (let i = 0; i < workSessions; i++) {
        subtasks.push({
          title: `Work session ${i + 1} - Focus on ${task.title}`,
          duration: Math.min(25, duration - 5 - (i * 30)),
          type: 'work'
        });

        if (i < workSessions - 1) {
          subtasks.push({
            title: 'Take a 5-minute break',
            duration: 5,
            type: 'break'
          });
        }
      }

      subtasks.push({
        title: 'Review and wrap up',
        duration: 5,
        type: 'review'
      });
    }

    return subtasks;
  }
}

export default new MLApi();
