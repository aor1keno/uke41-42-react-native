import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { millisecondsToHuman } from '../utils/TimerUtils';
import TimerButton from './TimerButton';

export default function Timer({ timer, onEdit, onToggle, onDelete }) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!timer.isRunning) return undefined;
        setNow(Date.now());
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [timer.isRunning, timer.startedAt]);

    const elapsed = timer.elapsed + (timer.isRunning ? now - (timer.startedAt ?? now) : 0);
    const elapsedString = millisecondsToHuman(elapsed);

    return (
        <View style={styles.timerContainer}>
            <Text style={styles.title}>{timer.title}</Text>
            <Text style={styles.project}>{timer.project}</Text>
            <Text style={styles.elapsedTime}>{elapsedString}</Text>
            <View style={styles.buttonGroup}>
                <TimerButton color="#315FEA" small title="Endre" onPress={onEdit} />
                <TimerButton color="#B42336" small title="Fjern" onPress={onDelete} />
            </View>
            <TimerButton
                color={timer.isRunning ? '#B42336' : '#167D55'}
                title={timer.isRunning ? 'Stopp' : 'Start'}
                onPress={onToggle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    timerContainer: {
        backgroundColor: '#FFFFFF',
        borderColor: '#DFE4EC',
        borderWidth: 1,
        borderRadius: 14,
        padding: 18,
        margin: 15,
        marginBottom: 0,
        shadowColor: '#17233B',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    title: {
        color: '#17233B',
        fontSize: 18,
        fontWeight: '800',
    },
    project: {
        color: '#697386',
        marginTop: 4,
    },
    elapsedTime: {
        color: '#17233B',
        fontSize: 34,
        fontWeight: '800',
        textAlign: 'center',
        paddingVertical: 15,
        fontVariant: ['tabular-nums'],
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
   
    