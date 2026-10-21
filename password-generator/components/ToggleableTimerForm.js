import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import TimerButton from './TimerButton';
import TimerForm from './TimerForm';

const ToggleableTimerForm = () => {
    
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={[styles.container, !isOpen && styles.buttonPadding]}>
            {isOpen ? (
                <TimerForm />
            ) : (
                <TimerButton 
                    title="+" 
                    color="black" 
                    toggleChange{() => setIsOpen(!isOpen) }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    buttonPadding: {
        paddingHorizontal: 15,
    },
});

export default ToggleableTimerForm;