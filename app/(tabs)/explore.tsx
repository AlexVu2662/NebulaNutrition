import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="analytics-sharp" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Track your Progress and Plan Ahead</ThemedText>
      </ThemedView>
      <ThemedText></ThemedText>
      <Collapsible title="View the Numbers in Graph Form">
        <ThemedText>
          We'll analyze and interpret your progress into intuitive, easy-to-understand graphs and charts, so you can spend more time working on your goals instead of trying to understand the numbers.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Choose from a Wide Range of Dietary Plans">
        <ThemedText>
            Whether it be pescetarianism, vegetarianism, or any other diet you so choose, we'll be there with you every step of the way.
          </ThemedText>
          <ExternalLink href="https://www.healthline.com/nutrition/9-weight-loss-diets-reviewed">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom Coaching">
        <ThemedText>
          After inputting data into our app, a diet and plan-specific AI assistant coach will give you daily tips and encouragement to keep you going strong on your wellness journey!
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -110,
    left: -10,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
