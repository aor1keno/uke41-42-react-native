import React, { useState } from 'react';
import { Button, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const numbers = '0123456789'.split('');
const symbols = ['#', '$', '%', '&', '*'];

type CharacterOptions = {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

function createPassword(
  length: number,
  minimumSymbols: number,
  options: CharacterOptions,
): string | null {
  if (!Number.isInteger(length) || length < 1) return null;
  if (!Number.isInteger(minimumSymbols) || minimumSymbols < 0 || minimumSymbols > length) {
    return null;
  }

  const availableCharacters = [
    ...(options.lowercase ? lowercaseLetters : []),
    ...(options.uppercase ? uppercaseLetters : []),
    ...(options.numbers ? numbers : []),
    ...(options.symbols ? symbols : []),
  ];
  if (availableCharacters.length === 0 || (minimumSymbols > 0 && !options.symbols)) {
    return null;
  }

  const password = Array.from({ length: minimumSymbols }, () =>
    symbols[Math.floor(Math.random() * symbols.length)],
  );
  for (let i = minimumSymbols; i < length; i += 1) {
    password.push(
      availableCharacters[Math.floor(Math.random() * availableCharacters.length)],
    );
  }

  for (let i = password.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}

function countSymbols(password: string): number {
  return [...password].filter((character) => symbols.includes(character)).length;
}

function parseCount(value: string): number {
  return /^\d+$/.test(value) ? Number(value) : 0;
}

export default function App() {
  const [antallTegn, setAntallTegn] = useState('');
  const [minimumSymboler, setMinimumSymboler] = useState('0');
  const [passord, setPassord] = useState('');
  const [error, setError] = useState('');
  const [isEnabledStoreBokstaver, setIsEnabledStoreBokstaver] = useState(false);
  const [isEnabledSmaaBokstaver, setIsEnabledSmaaBokstaver] = useState(false);
  const [isEnabledTall, setIsEnabledTall] = useState(false);
  const [isEnabledSymboler, setIsEnabledSymboler] = useState(false);

  function getOptions(symbolsEnabled = isEnabledSymboler): CharacterOptions {
    return {
      lowercase: isEnabledSmaaBokstaver,
      uppercase: isEnabledStoreBokstaver,
      numbers: isEnabledTall,
      symbols: symbolsEnabled,
    };
  }

  function repairPasswordIfNeeded(minimumSymbols: number, options: CharacterOptions) {
    if (!passord || countSymbols(passord) >= minimumSymbols) return;

    const replacement = createPassword(passord.length, minimumSymbols, options);
    if (replacement === null) {
      setError('Kan ikke oppfylle kravet med gjeldende innstillinger.');
      return;
    }

    setPassord(replacement);
    setError('');
  }

  function handleMinimumSymbolsChange(value: string) {
    const digitsOnly = value.replace(/\D/g, '');
    setMinimumSymboler(digitsOnly);
    setError('');
    repairPasswordIfNeeded(
      isEnabledSymboler ? parseCount(digitsOnly) : 0,
      getOptions(),
    );
  }

  function generateNewPassword() {
    const length = parseCount(antallTegn);
    const minimumSymbols = isEnabledSymboler ? parseCount(minimumSymboler) : 0;
    const generated = createPassword(length, minimumSymbols, getOptions());

    if (generated === null) {
      setError(
        length < 1
          ? 'Skriv inn antall tegn (minst 1).'
          : minimumSymbols > length
            ? 'Antall symboler kan ikke være større enn antall tegn.'
            : 'Velg minst én tegntype og slå på symboler for å kreve symboler.',
      );
      return;
    }

    setPassord(generated);
    setError('');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container1}>
        <Text style={styles.textHeading}>Passordgenerator</Text>
      </View>
      <View style={styles.container2}>
        <View style={styles.line}>
          <Text style={styles.textLine}>Store bokstaver</Text>
          <Switch
            thumbColor={isEnabledStoreBokstaver ? '#f4f310' : '#f4f3f4'}
            onValueChange={setIsEnabledStoreBokstaver}
            value={isEnabledStoreBokstaver}
          />
        </View>
        <View style={styles.line}>
          <Text style={styles.textLine}>Små bokstaver</Text>
          <Switch
            thumbColor={isEnabledSmaaBokstaver ? '#f4f310' : '#f4f3f4'}
            onValueChange={setIsEnabledSmaaBokstaver}
            value={isEnabledSmaaBokstaver}
          />
        </View>
        <View style={styles.line}>
          <Text style={styles.textLine}>Tall</Text>
          <Switch
            thumbColor={isEnabledTall ? '#f4f310' : '#f4f3f4'}
            onValueChange={setIsEnabledTall}
            value={isEnabledTall}
          />
        </View>
        <View style={styles.line}>
          <Text style={styles.textLine}>Symboler</Text>
          <Switch
            thumbColor={isEnabledSymboler ? '#f4f310' : '#f4f3f4'}
            onValueChange={(enabled) => {
              setIsEnabledSymboler(enabled);
              if (enabled) {
                repairPasswordIfNeeded(
                  parseCount(minimumSymboler),
                  getOptions(true),
                );
              }
            }}
            value={isEnabledSymboler}
          />
          <TextInput
            accessibilityLabel="Minimum antall symboler"
            editable={isEnabledSymboler}
            keyboardType="number-pad"
            maxLength={3}
            onChangeText={handleMinimumSymbolsChange}
            placeholder="Min."
            style={[styles.input, !isEnabledSymboler && styles.disabledInput]}
            value={minimumSymboler}
          />
        </View>
        <View style={styles.line}>
          <Text style={styles.textLine}>Antall tegn</Text>
          <TextInput
            accessibilityLabel="Antall tegn i passordet"
            keyboardType="number-pad"
            maxLength={3}
            onChangeText={(value) => setAntallTegn(value.replace(/\D/g, ''))}
            style={styles.input}
            value={antallTegn}
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View style={styles.container4}>
        <Button title="Generer passord" onPress={generateNewPassword} />
      </View>
      <View style={styles.container3}>
        <Text style={styles.textLine}>Passord:</Text>
        <Text style={styles.password} selectable>
          {passord}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container1: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 2,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
  },
  container3: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  container4: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    minWidth: 70,
    padding: 10,
    fontSize: 20,
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
  },
  disabledInput: {
    opacity: 0.5,
  },
  textHeading: {
    color: 'white',
    fontSize: 35,
  },
  textLine: {
    color: 'black',
    fontSize: 20,
  },
  password: {
    color: 'white',
    fontSize: 20,
    backgroundColor: 'grey',
  },
  error: {
    color: '#b00020',
    marginTop: 12,
  },
});
