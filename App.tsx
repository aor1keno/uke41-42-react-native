import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Weather = {
  place: string;
  temperature: number;
  description: string;
};

const conditions: Record<number, string> = {
  0: 'Klart',
  1: 'For det meste klart',
  2: 'Delvis skyet',
  3: 'Overskyet',
  45: 'Tåke',
  48: 'Tåke',
  51: 'Yr',
  53: 'Yr',
  55: 'Yr',
  61: 'Regn',
  63: 'Regn',
  65: 'Kraftig regn',
  71: 'Snø',
  73: 'Snø',
  75: 'Kraftig snø',
  80: 'Regnbyger',
  81: 'Regnbyger',
  82: 'Kraftige regnbyger',
  95: 'Tordenvær',
};

export default function App() {
  const [place, setPlace] = useState('');
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function searchWeather() {
    const search = place.trim();
    if (!search) {
      setError('Skriv inn et stedsnavn.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const geocoding = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({
          name: search,
          count: '1',
          language: 'no',
          format: 'json',
        })}`,
      );
      if (!geocoding.ok) throw new Error('Kunne ikke søke etter stedet.');

      const locations = (await geocoding.json()) as {
        results?: { name: string; country?: string; latitude: number; longitude: number }[];
      };
      const location = locations.results?.[0];
      if (!location) throw new Error(`Fant ikke «${search}».`);

      const forecast = await fetch(
        `https://api.open-meteo.com/v1/forecast?${new URLSearchParams({
          latitude: String(location.latitude),
          longitude: String(location.longitude),
          current: 'temperature_2m,weather_code',
          timezone: 'auto',
        })}`,
      );
      if (!forecast.ok) throw new Error('Kunne ikke hente været.');

      const result = (await forecast.json()) as {
        current: { temperature_2m: number; weather_code: number };
      };
      setWeather({
        place: [location.name, location.country].filter(Boolean).join(', '),
        temperature: result.current.temperature_2m,
        description: conditions[result.current.weather_code] ?? 'Ukjent vær',
      });
    } catch (cause) {
      setWeather(null);
      setError(
        cause instanceof Error
          ? cause.message
          : 'Noe gikk galt. Prøv igjen.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.title}>Værmelding</Text>
        <Text style={styles.subtitle}>Sjekk været hvor som helst i verden</Text>

        <View style={styles.search}>
          <TextInput
            accessibilityLabel="Sted"
            autoCapitalize="words"
            onChangeText={setPlace}
            onSubmitEditing={() => void searchWeather()}
            placeholder="Skriv inn et sted"
            placeholderTextColor="#9baabd"
            returnKeyType="search"
            style={styles.input}
            value={place}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => void searchWeather()}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.buttonText}>Søk</Text>
          </Pressable>
        </View>

        {loading ? <ActivityIndicator color="#ffffff" size="large" /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {weather ? (
          <View style={styles.result}>
            <Text style={styles.place}>{weather.place}</Text>
            <Text
              style={[
                styles.temperature,
                weather.temperature < 0 && styles.cold,
              ]}
            >
              {Math.round(weather.temperature)}°
            </Text>
            <Text style={styles.description}>{weather.description}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.credit}>Værdata fra Open-Meteo</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#14243a',
    justifyContent: 'space-between',
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 24,
    paddingTop: 72,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#b8c6d8',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 32,
    textAlign: 'center',
  },
  search: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: '#14243a',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#78c3a4',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginLeft: 8,
  },
  buttonText: {
    color: '#10251f',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  error: {
    color: '#ff9c9c',
    fontSize: 15,
    textAlign: 'center',
  },
  result: {
    alignItems: 'center',
    marginTop: 20,
  },
  place: {
    color: '#d7e2ef',
    fontSize: 20,
    textAlign: 'center',
  },
  temperature: {
    color: '#ffffff',
    fontSize: 88,
    fontWeight: '300',
    marginVertical: 8,
  },
  cold: {
    color: '#ff7474',
  },
  description: {
    color: '#d7e2ef',
    fontSize: 19,
  },
  credit: {
    color: '#8fa0b5',
    fontSize: 12,
    padding: 16,
    textAlign: 'center',
  },
});
