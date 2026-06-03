import { ShareIntentProvider } from "expo-share-intent";
import { WatchScreen } from "./src/screens/WatchScreen";

export default function App() {
  return (
    <ShareIntentProvider>
      <WatchScreen />
    </ShareIntentProvider>
  );
}
