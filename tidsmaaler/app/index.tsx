import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import EditableTimer from '../components/EditableTimer';
import ToggleableTimerForm from '../components/ToggleableTimerForm';
import { newTimer } from '../utils/TimerUtils';

type TimerData = {
  id: string;
  title: string;
  project: string;
  elapsed: number;
  isRunning: boolean;
  startedAt: number | null;
};

const initialTimers: TimerData[] = [
  {
    id: 'garden',
    title: 'Klippe plenen',
    project: 'Hageaktivitet',
    elapsed: 8986300,
    isRunning: false,
    startedAt: null,
  },
  {
    id: 'baking',
    title: 'Bake kake',
    project: 'Kjøkkenaktivitet',
    elapsed: 3890985,
    isRunning: false,
    startedAt: null,
  },
];

export default function App() {
  const [timers, setTimers] = useState<TimerData[]>(initialTimers);

  function createTimer(attributes: { title: string; project: string }) {
    setTimers((currentTimers) => [newTimer(attributes), ...currentTimers]);
  }

  function updateTimer(updatedTimer: TimerData) {
    setTimers((currentTimers) =>
      currentTimers.map((timer) =>
        timer.id === updatedTimer.id ? { ...timer, ...updatedTimer } : timer,
      ),
    );
  }

  function toggleTimer(timer: TimerData) {
    if (timer.isRunning) {
      updateTimer({
        ...timer,
        elapsed: timer.elapsed + Date.now() - (timer.startedAt ?? Date.now()),
        isRunning: false,
        startedAt: null,
      });
      return;
    }

    updateTimer({ ...timer, isRunning: true, startedAt: Date.now() });
  }

  function removeTimer(id: string) {
    setTimers((currentTimers) => currentTimers.filter((timer) => timer.id !== id));
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>TIDSMÅLER</Text>
        <Text style={styles.title}>Ta tiden på det du gjør.</Text>
        <Text style={styles.subtitle}>
          Start en oppgave, ta pause når du vil, og hold oversikt over tiden.
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.timerList}>
        <ToggleableTimerForm onCreate={createTimer} />
        {timers.length === 0 ? (
          <Text style={styles.emptyMessage}>Ingen tidtakere ennå. Opprett en over.</Text>
        ) : (
          timers.map((timer) => (
            <EditableTimer
              key={timer.id}
              timer={timer}
              onUpdate={updateTimer}
              onToggle={() => toggleTimer(timer)}
              onDelete={() => removeTimer(timer.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  header: {
    backgroundColor: '#17233B',
    paddingHorizontal: 24,
    paddingTop: 58,
    paddingBottom: 28,
  },
  eyebrow: {
    color: '#95B9FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#CCD5E5',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  timerList: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  emptyMessage: {
    color: '#697386',
    fontSize: 15,
    paddingHorizontal: 24,
    paddingTop: 18,
    textAlign: 'center',
  },
});
