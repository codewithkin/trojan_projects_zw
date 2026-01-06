import { Stack } from "expo-router";

export default function NewLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="quote"
        options={{
          title: "New Quote",
        }}
      />
      <Stack.Screen
        name="project"
        options={{
          title: "New Project",
        }}
      />
    </Stack>
  );
}
