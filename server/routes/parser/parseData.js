export const parseTrainingLogData = (data) => {
    const trainingLog = data.map((logEntry) => {
        const date = Object.keys(logEntry)[0];
        const [day, month, year] = date.split('-');

        const exercises = Object.entries(logEntry[date]).map(([exerciseName, exerciseDetails]) => {
            const series = exerciseDetails.series.map((set) => ({
                weight: set.weight === undefined || set.weight === '' ? null : parseFloat(set.weight),
                reps: parseInt(set.reps) || null,
                distance: set.distance === undefined || set.distance === '' ? null : parseFloat(set.distance),
                time: parseInt(set.time) || null,
            }));

            return {
                name: exerciseName,
                sets: series,
            };
        });
        const parsedDate = new Date(Date.UTC(year, month - 1, day));
        parsedDate.setUTCHours(0, 0, 0, 0);

        return {
            date: parsedDate,
            exerciseDetails: exercises,
        };
    });

    return { trainingLog };
};

export const parseRoutineData = (input) => {
    const routine = input.map((routineEntry) => {
        const routineName = Object.keys(routineEntry)[0];
    
        const exercises = routineEntry[routineName].map((exercise) => ({
          name: exercise.name || '',
          category: exercise.category || '',
          type: exercise.type || '',
          description: exercise.description || '',
        }));
    
        return {
          name: routineName,
          exercise: exercises,
        };
      });
    
      return { routine };
};