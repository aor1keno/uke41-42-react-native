import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import TimerButton from './TimerButton';
import TimerForm from './TimerForm';

const ToggleableTimerForm = ({ onCreate }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={[styles.container, !isOpen && styles.buttonPadding]}>
            {isOpen ? (
                <TimerForm
                    onSubmit={(attributes) => {
                        onCreate(attributes);
                        setIsOpen(false);
                    }}
                    onCancel={() => setIsOpen(false)}
                />
            ) : (
                <TimerButton 
                    title="+  Ny tidtaker" 
                    color="#315FEA" 
                    onPress={() => setIsOpen(true)}
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
        paddingHorizontal: 8,
    },
});

export default ToggleableTimerForm;