import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding on first load
    router.replace("/onboarding");
  }, []);

  return null;
}
