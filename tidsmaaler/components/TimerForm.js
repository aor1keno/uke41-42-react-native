import React, { useState } from 'react';

import { StyleSheet, View, Text, TextInput } from 'react-native';
import TimerButton from './TimerButton';

export default function TimerForm({ id, title = '', project = '', onSubmit, onCancel }) {
    const [formTitle, setFormTitle] = useState(title);
    const [formProject, setFormProject] = useState(project);
    const [error, setError] = useState('');
    const submitText = id ? 'Oppdater' : 'Opprett';

    function submitForm() {
        const cleanTitle = formTitle.trim();
        const cleanProject = formProject.trim();
        if (!cleanTitle || !cleanProject) {
            setError('Fyll inn både navn og kategori.');
            return;
        }

        onSubmit({ title: cleanTitle, project: cleanProject });
    }

    return (
        <View style={styles.formContainer}>
            <View style={styles.attributeContainer}>
                <Text style={styles.textInputTitle}>Navn</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid="transparent"
                        value={formTitle}
                        onChangeText={setFormTitle}
                        placeholder="For eksempel: Lese"
                        accessibilityLabel="Navn på tidtakeren"
                    />
                </View>
            </View>
            <View style={styles.attributeContainer}>
                <Text style={styles.textInputTitle}>Kategori</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid="transparent"
                        value={formProject}
                        onChangeText={setFormProject}
                        placeholder="For eksempel: Studier"
                        accessibilityLabel="Kategori eller prosjekt"
                    />
                </View>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.buttonGroup}>
                <TimerButton small color="#167D55" title={submitText} onPress={submitForm} />
                <TimerButton small color="#B42336" title="Avbryt" onPress={onCancel} />
            </View>
        </View>
    );
}
       
const styles = StyleSheet.create({
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderColor: '#DFE4EC',
        borderWidth: 1,
        borderRadius: 14,
        padding: 15,
        margin: 15,
        marginBottom: 0,
    },
    attributeContainer: {
        marginVertical: 8,
    },
    textInputContainer: {
        borderColor: '#D6DBE5',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 5,
        backgroundColor: '#FFFFFF',
    },
    textInput: {
        minHeight: 44,
        paddingHorizontal: 12,
        fontSize: 15,
        color: '#17233B',
    },
    textInputTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#33415C',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    error: {
        color: '#B42336',
        marginTop: 4,
        fontSize: 13,
    },
});